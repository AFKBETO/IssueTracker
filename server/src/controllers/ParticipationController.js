const { User, Project, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler, errorType } = require('./ErrorHandler')

module.exports = {
    /* 
    Assign new participant to a project
    Permission: {
        1: Assign any user to a project (Administrator)
        2: Assign any user to one of their managed projects (Project Manager)
    }
    body: {
        projectId: Project id (required),
        userId: User id (required)
    }
    */
    async create (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            // check if user has authorization
            const project = await Project.findByPk(req.body.projectId)
            if (!project) {
                throw errorType("ProjectNotFound","Project not found")
            }
            if (decoded.role == 2 && decoded.id != project.manageByUser) {
                throw errorType("UnauthorizedAction", "You are not authorized to assign people to this project.")
            }
            const [participant] = await Participation.findOrCreate({
                where:{
                    UserId: req.body.userId,
                    ProjectId: req.body.projectId
                },
                paranoid: false
            })
            participant.restore()
            res.status(201).send(participant)
            
        }
        catch (err) {
            errorHandler(res, err, "Unable to assign participant")
        }
    },
    /* 
    Read all projects that a specific user participate
    Permission: All
    params: {
        userId: User id (required)
    }
    */
    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            const user = await User.findByPk(parseInt(req.params.userId),{
                include: {
                    model: Project,
                    through: {
                        model: Participation
                    }
                }
            })
            if (!user) {
                throw errorType("UserNotFound","User not found")
            }
            res.status(200).send(user.Projects)
            
        }
        catch (err) {
            errorHandler(res, err, "Error")
        }
    },
    /* 
    Remove an user from a project
    Permission: {
        1: Remove any user from a project except for the current project manager (Administrator)
        2: Remove any user from one of user's managed projects (Project Manager)
    }
    body: {
        userId: UserId,
        projectId: ProjectId
    }
    */
    async remove (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            // search if project is valid
            const project = await Project.findByPk(req.body.projectId)
            if (!project) {
                throw errorType("ProjectNotFound","Project not found")                 
            }
            if (decoded.role == 2 && decoded.id != project.manageByUser) {
                throw errorType("UnauthorizedAction", "You are not authorized to modify others' projects.")
            }
            if (req.body.userId == project.manageByUser) {
                throw new Error("Cannot remove current manager from project")
            }
            const participation = await Participation.findOne({
                where: {
                    UserId: req.body.userId,
                    ProjectId: req.body.projectId
                }
            })
            if (participation) await participation.destroy()
            res.status(204).send({
                message: "The user is removed from project."
            })
        }
        catch (err) {
            errorHandler(res, err, "Failure to remove user from project")
        }
    }
}