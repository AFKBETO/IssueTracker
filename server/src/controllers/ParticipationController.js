const { User, Project, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')

module.exports = {
    /* 
    Assign new participant to a project
    Permission: 2 (Project Manager)
    body: {
        ProjectID: Project id (required),
        UserID: User id (required)
    }
    */
    async create (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            // check if user has authorization
            if (decoded.role == 2 && decoded.id != req.body.ProjectId) {
                const e = new Error("You are not authorized to assign people to this project.")
                e.name = "UnauthorizedAction"
                throw e
            }
            const participant = await Participation.create({
                UserId: req.body.UserId,
                ProjectId: req.body.ProjectId
            })
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
    }
}