const { Project, User, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler, errorType } = require('./ErrorHandler')
const { Op } = require('sequelize')

module.exports = {
    /* 
    Create a new project
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
                    throw errorType("UserNotFound","User not found")
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
    Read all projects of a user
    Permission: 1 (Administrator)
    params: {
        userId: User ID (for admin options)
    }
    */
    async readAll (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 1)
            const option = {}
            // parse options
            const userId = parseInt(req.params.userId)
            if (userId > 0) {
                option.manageByUser = userId
            }
            const projects = await Project.findAll({
                where: option
            })
            if (projects.length == 0) {
                throw errorType("ProjectNotFound","Project not found")
            }
            res.status(200).send(projects)
        }
        catch (err) {
            errorHandler(res, err, "Unable to read projects")
        }
    },
    /* 
    Read all managed projects
    Permission: 2 (Admin + Manager)
    */
    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            const projects = await Project.findAll({
                where: {
                    manageByUser: decoded.id
                }
            })
            if (projects.length == 0) {
                throw errorType("ProjectNotFound","Project not found")
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
                        throw errorType("UserNotFound","User not found")
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
                throw new Error("No parameter set")
            }
            const project = await Project.findOne({
                where: options
            })
            if (!project){
                throw errorType("ProjectNotFound","Project not found")
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
                    id: parseInt(req.params.projectId)
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