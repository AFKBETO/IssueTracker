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
            errorHandler(res, err, "Unable to create project")
        }
        return
    },
    /* 
    Read all projects
    Permission: {
        1: Read all projects (Administrator)
        2: Read all managed projects (Project Manager)
    }
    params: {
        userId: User ID (for admin options)
    }
    */
    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            const option = {}
            // parse options
            if (req.params.userId > 0) {
                option.manageByUser = req.params.userId
            }
            if (decoded.role == 2 && Object.keys(option).length) {
                const e = new Error("You are not authorized for this action.")
                e.name = "UnauthorizedAction"
                throw e
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
            errorHandler(res, err, "Unable to read project")
        }
    },
    /* 
    Update a project
    Permission: {
        1: Update any project (Administrator)
        2: Update any managed project (Project Manager)
    }
    params: {
        projectId: ProjectId (required)
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
            const options = {
                id: parseInt(req.params.projectId)
            }
            // allow manager modification if user is admin
            if (decoded.role == 1) {
                if (req.body.manageByUser){
                    const user = await User.findByPk(req.body.manageByUser)
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
            // lock user id in options if user is manager
            if (decoded.role == 2){
                options.manageByUser = decoded.id
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
            const project = await Project.findOne({
                where: options
            })
            if (!project){
                const e = new Error("Project not found or not managed by user.")
                e.name = "ProjectNotFound"
                throw e
            }
            project.set(data)
            await project.save()
            // check if new associated participation exists, and create if not
            if (data.manageByUser){
                const [participation] = await Participation.findOrCreate({
                    where: {
                        UserId : data.manageByUser,
                        ProjectId: parseInt(req.params.projectId)
                    },
                    paranoid: false
                })
                participation.restore()
            }
            
            res.status(200).send(project)

        }
        catch (err) {
            errorHandler(res, err, "Unable to update project")
        }
    },
    /* 
    Delete a project
    Permission: 1 (Administrator)
    params: {
        projectId: projectId (required)
    }
    */
    async remove (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 1)
            await Project.destroy({
                where: {
                    id: req.params.projectId
                }
            })
            res.status(204).send({
                message: "The project is successfully removed."
            })
        }
        catch (err) {
            errorHandler(res, err, "Failure to remove project")
        }
    }
}