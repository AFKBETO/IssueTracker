const { Project, User, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')
const { Op } = require('sequelize')

module.exports = {
    /* 
    Read projects
    Minimum permission: {
        1: Create a project and assign it to a manager (Administrator)
        2: Create a project (Project Manager)
    }
    input: {
        name: Project name (required, not null),
        manageByUser: Project manager: {
            optional
            skipped if request made by role#2
            the assigned manager must have the minimum permission
        }
        description: Project description (optional)
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
                    throw Error("The selected user does not have the permission to manage a project.")
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
    Read projects
    Minimum permission: {
        1: Read any project (Administrator)
        2: Read any managed project (Project Manager)
    }
    input: {
        ProjectId: ProjectId (optional)
        userId[]: array (optional, ignored if role#2)
        before: Date (optional, in ms),
        after: Date (optional, in ms),
    }
    If input is empty, read all projects that current user is authorized to read
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
                error: `Unable to read projects: ${error.message}`
            })
        }
    },
    /* 
    Update a project
    Minimum permission: {
        1: Update any project (Administrator)
        2: Update any managed project (Project Manager)
    }
    input: {
        id: ProjectId (required),
        managedByUser: Project Manager {
            optional,
            only available to role#1,
            the assigned manager must have the minimum permission
        },
        description: Project description (optional, required for role#2)
    }
     */
    async update(req, res) {
        try { 
            const decoded = jwtVerifyUser(req, 2)
            const data = {}
            const option = {
                id: parseInt(req.params.projectId)
            }
            if (decoded.role == 1) {
                if (req.body.manageByUser){
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
                        throw new Error("The selected user does not have the permission to manage a project.")
                    }
                    data.manageByUser = user.id
                }
            }
            if (decoded.role == 2) {
                option.manageByUser = decoded.id
            }
            if (req.body.description) {
                data.description = req.body.description 
            }
            if (Object.keys(data).length == 0){
                const e = new Error("No parameter set")
                throw e
            }
            const project = await Project.update(data, {where: option})
            if (!project[0]){
                const e = new Error("Project not found.")
                e.name = "ProjectNotFound"
                throw e
            }
            res.status(200).send(project)

        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to update project: ${error.message}`
            })
        }
    }
}