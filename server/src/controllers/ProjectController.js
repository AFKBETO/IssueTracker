const { Project, User, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')
const { Op } = require('sequelize')

module.exports = {
    /* 
    Creating a new project
    Minimum permission: 2 (Project Manager)
    input: {
        name: Project name,
        manageByUser: Project manager: {
            optional
            skipped if request made by role#2
            the assigned manager must have the minimum permission
        }
        description: Project description
    }
    */
    async create (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            var id = decoded.id
            if (decoded.role == 1 && req.body.manageByUser) {
                const user = await User.findOne({
                    where: {
                        id: req.body.manageByUser
                    }
                })
                if (!user) {
                    const e = new Error("User not found")
                    e.name = "UserNotFound"
                    throw e
                }
                if (user.role > 2) {
                    const e = new Error("The selected user does not have the authorization to manage a project.")
                    e.name = "InvalidUser"
                    throw e
                }
                id = user.id
            }
            const project = await Project.create({
                name: req.body.name,
                manageByUser: id,
                description: req.body.description,
                createdBy: decoded.id
            })
            const participation = await Participation.create({
                UserId: project.manageByUser,
                ProjectId: project.id
            })
            res.status(200).send({
                message: "Project successfully created."
            })
        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to create project: ${error.message}`
            })
        }
        return
    },
    /* 
    Read a project
    Minimum permission: {
        1: Read any project (Administrator)
        2: Read any created project (Project Manager)
    }
    input: {
        ProjectId: ProjectId
        userId[]: array, (ignored if role#2)
        before: Date (in ms),
        after: Date (in ms),
    }
    */
    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            const option = {}          
            if (req.body || decoded.role == 2) {
                if (req.body.ProjectId){
                    option.id = req.body.ProjectId
                }
                if (decoded.role == 1 && req.body.userId) {
                    option.manageByUser = req.body.userId
                }
                if (decoded.role == 2){
                    option.manageByUser = decoded.id
                }
                if (req.body.before) {
                    option.createdAt = {
                        [Op.lte] : new Date(req.body.before)
                    }
                }
                if (req.body.after) {
                    option.createdAt = {
                        [Op.gte] : new Date(req.body.after)
                    }
                }
            }
            const projects = await Project.findAll({
                where: option
            })
            if (projects.length == 0) {
                const e = new Error("Projects not found")
                e.name = "ProjectNotFound"
                throw e
            }
            res.status(200).send(projects)

        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to read project: ${error.message}`
            })
        }
    }
}