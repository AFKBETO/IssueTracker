const { User, Project, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')

module.exports = {
    /* 
    Assign new participant to a project
    Minimum permission: 2 (Project Manager)
    body: {
        ProjectID: Project id,
        UserID: User id,
        manageByUser: optional
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
            const option = {
                id: req.body.ProjectId,
            }
            // case admin: can assign people to other managers' projects
            // case managers: only assign people to their own projects
            if (decoded.role == 2){
                option.manageByUser = decoded.id
            }
            else if (decoded.role == 1 && req.body.manageByUser) {
                option.manageByUser = req.body.manageByUser
            }
            const project = await Project.findOne({where: option})
            if (!project) {
                const e = new Error("Project not found")
                e.name = "ProjectNotFound"
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
            res.status(200).send({
                message: "Participant successfully assigned."
            })
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