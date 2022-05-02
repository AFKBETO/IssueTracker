const { Project, User, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')
const { Op } = require('sequelize')

module.exports = {
    /* 
    Read projects
    Permission: {
        1: Create a project and assign it to a manager (Administrator)
        2: Create a project (Project Manager)
    }
    body: {
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
            // check if current user is admin
            // and assigning the new project to another manager
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
            // create project
            const project = await Project.create({
                name: req.body.name,
                manageByUser: id,
                description: req.body.description,
                createdBy: decoded.id
            })
            // create associated participation
            const participation = await Participation.create({
                UserId: project.manageByUser,
                ProjectId: project.id
            })
            res.status(201).send(project)
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
    Permission: {
        1: Read any project (Administrator)
        2: Read any managed project (Project Manager)
    }
    body: {
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
            // parse options
            if (req.body || decoded.role == 2) {
                if (req.body.ProjectId){
                    option.id = req.body.ProjectId
                }
                // admin can read any project
                if (decoded.role == 1 && req.body.userId) {
                    option.manageByUser = req.body.userId
                }
                // parse condition to fetch all projects of current user
                // if current manager is a manager
                if (decoded.role == 2){
                    option.manageByUser = decoded.id
                }
                // parse date and time
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
    Permission: {
        1: Update any project (Administrator)
        2: Update any managed project (Project Manager)
    }
    params: {
        id: ProjectId (required)
    }
    body: {
        name: Project name (optional, not null)
        managedByUser: Project Manager {
            optional,
            only available to role#1 (ignored by role#2),
            the assigned manager must have the minimum permission
        },
        description: Project description (optional, required for role#2)
    }
    */
    async update(req, res) {
        try { 
            const decoded = jwtVerifyUser(req, 2)
            const data = {}
            // allow manager modification if user is admin
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
            // parse other data to modify
            if (req.body.name) {
                data.name = req.body.name 
            }
            if (req.body.description) {
                data.description = req.body.description 
            }
            // throw error if no modification specified
            if (Object.keys(data).length == 0){
                const e = new Error("No parameter set")
                throw e
            }
            // find if project exists
            let project = await Project.findOne({
                where: {
                    id: parseInt(req.params.projectId)
                }
            })
            if (!project){
                const e = new Error("Project not found.")
                e.name = "ProjectNotFound"
                throw e
            }
            // check if the current user is manager
            // and trying to modify non-owned project
            if (decoded.role == 2 && project.manageByUser != decoded.id) {
                const e = new Error("You are not authorized for this action.")
                e.name = "UnauthorizedAction"
                throw e
            }
            project.set(data)
            await project.save()
            // check if new associated participation exists, and create if not
            if (data.manageByUser){
                const [participation, created] = await Participation.findOrCreate({
                    where: {
                        UserId : project.manageByUser,
                        ProjectId: project.id
                    }
                })
            }
        
            res.status(201).send(project)

        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to update project: ${error.message}`
            })
        }
    },
    /* 
    Delete a project
    Permission: 1 (Administrator)
    params: {
        id: ProjectId (required)
    }
    */
    async delete (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 1)
            await Project.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(204).send({
                message: "The project is successfully deleted."
            })
        }
        catch (err) {
            res.status(500).send({
                error: `Failure to delete project: ${err.message}`
            })
        }
    }
}