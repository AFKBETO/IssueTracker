const { Project, User, Participation } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')

module.exports = {
    /* 
    Creating a new project
    Minimum permission: 2 (Project Manager)
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
                    const e = new Error("The selected user does not have the authorization to manage a project.")
                    e.name = "InvalidUser"
                    throw e
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

    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            const {id} = req.body
            const project = await Project.findAll({
                where: {
                    manageByUser: decoded.id
                }
            })
            

        }
        catch (err) {
            const error = errorHandler(err)
            res.status(error.status).send({
                error: `Unable to read project: ${error.message}`
            })
        }
    }
}