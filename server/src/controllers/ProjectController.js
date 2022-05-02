const { Project } = require('../database/models')
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
            const project = await Project.create({
                name: req.body.name,
                manageByUser: decoded.id,
                description: req.body.description
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