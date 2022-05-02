const { User, Project, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')

module.exports = {
    async create (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 2)
            const option = {
                id: req.body.id,
                manageByUser: (decoded.role == 2)? decoded.id : req.body.manageByUser
            }
            const user = await User.findOne({
                id: option.manageByUser
            })
            if (!user) {
                const e = new Error("User not found")
                e.name = "UserNotFound"
                throw e
            }
            const project = await Project.findOne(option)
            if (!project) {
                const e = new Error("Project not found")
                e.name = "ProjectNotFound"
                throw e
            }
            const participant = Participation.create({
                UserId: user.id,
                ProjectId: project.id
            })
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