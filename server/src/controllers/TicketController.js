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
    Read all tickets in a project
    Permission: All
    params {
        idProject: Project id (required)
    }
    */
    async readProject (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            
            const idProject = parseInt(req.params.idProject)
            if (!idProject) {
                throw new Error("Syntax error: idProject")
            }
            const options = {
                idProject: idProject
            }
            // search for tickets
            const tickets = await Ticket.findAll({
                where: options
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
    },
    /* 
    Read all tickets in a project
    Permission: All
    params {
        idUser: User id (required)
    }
    */
    async readUser (req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            
            const idUser = parseInt(req.params.idUser)
            if (!idUser) {
                throw new Error("Syntax error: idUser")
            }
            const options = {
                idUser: idUser
            }
            // search for tickets
            const tickets = await Ticket.findAll({
                where: options
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