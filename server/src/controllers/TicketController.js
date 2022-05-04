const { User, Project, Participation, Ticket } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler } = require('./ErrorHandler')
const { decode } = require('jsonwebtoken')

module.exports = {
    /* 
    Open a ticket new participant to a project
    Permission: All
    body: {
        idProject: Project id (required),
        name: Ticket name (not null)
        description: Ticket description (optional)
    }
    */
    async create (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            //check if user is participating in the project
            const participation = await Participation.findOne({
                where: {
                    UserId: decoded.id,
                    ProjectId: req.body.idProject
                }
            })
            if (!participation) {
                const e = new Error("You are not in the project.")
                e.name = "UnauthorizedAction"
                throw e
            }
            //create the ticket
            const ticket = await Ticket.create({
                issueByUser: decoded.id,
                idProject: req.body.idProject,
                name: req.body.name,
                description: req.body.description
            })
            res.status(201).send(ticket)
        }
        catch (err) {
            errorHandler(res, err, "Unable to create ticket")
        }
    },
    /* 
    Read all tickets of a user in a project
    Permission: {
        1: Can read all tickets (Administrator)
        Others: Can read all tickets in project the user participate in
    }
    params {
        idProject: Project id (0 to find in all projects),
        idUser: User id (0 to find from all user)
    }
    */
    async read (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            const options = {}
            if (req.params.idProject) {
                options["ProjectId"] = req.params.idProject
            }
            // check if user is participating in the project; admin can bypass this condition
            if (decoded.role > 1) {
                options["UserId"] = decoded.id
            }
            const projects = await Participation.findAll({
                attributes: ["ProjectId"],
                where: options
            })
            if (!projects.length) {
                const e = new Error("Project not found")
                e.name = "ProjectNotFound"
                throw e
            }
            options["ProjectId"] = projects
            delete options["UserId"]
            // search for user ID; omitted when search all
            if (req.params.idUser) {
                options["UserId"] = req.params.idUser
            }
            const users = await Participation.findAll({
                attributes: ["UserId"],
                where: options
            })
            if (!users.length) {
                const e = new Error("User not found")
                e.name = "UserNotFound"
                throw e
            }
            // search for tickets
            const tickets = await Ticket.findAll({
                where: {
                    issueByUser: users,
                    idProject: projects
                }
            })
            if (!tickets.length) {
                const e = new Error("Ticket not found")
                e.name = "TicketNotFound"
                throw e
            }
            res.status(201).send(tickets)
        }
        catch (err) {
            errorHandler(res, err, "Unable to find ticket")
        }
    }
}