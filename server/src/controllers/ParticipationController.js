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
            // search for user
            const user = await User.findOne({
                where: {
                    id: req.body.UserId
                }
            })
            if (!user) {
                const e = new Error("User not found")
                e.name = "UserNotFound"
                throw e
            }
            //search for project
            const project = await Project.findOne({
                where: {
                    id: req.body.ProjectId,
                }
            })
            if (!project) {
                const e = new Error("Project not found")
                e.name = "ProjectNotFound"
                throw e
            }
            // check if user has authorization
            if (decoded.role == 2 && decoded.id != project.manageByUser) {
                const e = new Error("You are not authorized to assign people to this project.")
                e.name = "UnauthorizedAction"
                throw e
            }
            try {
                const participant = await Participation.create({
                    UserId: user.id,
                    ProjectId: project.id
                })
            }
            catch (err) {
                const e = new Error("Participant already assigned in the project.")
                e.name = "ParticipantAlreadyAssigned"
                throw e
            }
            res.status(201).send(participant)
        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to assign participant: ${error.message}`
            })
        }
        return
    }
}