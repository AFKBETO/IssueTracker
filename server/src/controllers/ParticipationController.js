const { User, Project, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')

module.exports = {
    /* 
    Assign new participant to a project
    Permission: 2 (Project Manager)
    body: {
        projectID: Project id (required),
        userID: User id (required)
    }
    */
    async create (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            // check if user has authorization
            if (decoded.role == 2 && decoded.id != req.body.projectId) {
                const e = new Error("You are not authorized to assign people to this project.")
                e.name = "UnauthorizedAction"
                throw e
            }
            const [participant] = await Participation.findOrCreate({
                where:{
                    UserId: req.body.userId,
                    ProjectId: req.body.projectId
                },
                paranoid: false,
                defaults: {
                    deletedAt: null
                }
            })
            participant.restore()
            res.status(201).send(participant)
            
        }
        catch (err) {
            console.log(err.name)
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to assign participant: ${error.message}`
            })
        }
    },
    /* 
    Read all projects that a specific user participate
    Permission: {
        1: Read all projects participated by any user (Administrator)
            To read all projects, refer to ProjectController
        Others: Read all participated projects (Manager, Dev & Submittor)
    }
    params: {
        userId: User id (required)
    }
    */
    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            if (decoded.role > 1 && decoded.id != req.params.userId) {
                const e = new Error("You are not authorized for this action.")
                e.name = "UnauthorizedAction"
                throw e            
            }
            const user = await User.findByPk(parseInt(req.params.userId),{
                include: {
                    model: Project,
                    through: {
                        model: Participation
                    }
                }
            })
            if (!user) {
                const e = new Error("User not found")
                e.name = "UserNotFound"
                throw e                     
            }
            res.status(200).send(user.Projects)
            
        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: error.message
            })
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
    async delete (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            // search if project is valid
            const project = await Project.findByPk(req.body.projectId)
            if (!project) {
                const e = new Error("Project not found")
                e.name = "ProjectNotFound"
                throw e                  
            }
            if (decoded.role == 2 && decoded.id != project.manageByUser) {
                const e = new Error("You are not authorized to modify others' projects.")
                e.name = "UnauthorizedAction"
                throw e                  
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
            res.status(500).send({
                error: `Failure to remove user from project: ${err.message}`
            })
        }
    }
}