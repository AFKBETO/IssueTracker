const { User, Project, Participation, Ticket } = require('../database/models')
const { jwtVerifyUser } = require('./VerifyController')
const { errorHandler, errorType } = require('./ErrorHandler')

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
                throw errorType("UnauthorizedAction","You are not in the project.")
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
                throw errorType("TicketNotFound","Ticket not found")
            }
            res.status(201).send(tickets)
        }
        catch (err) {
            errorHandler(res, err, "Unable to find ticket")
        }
    },
    /* 
    Read all tickets of a user
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
                issueByUser: idUser
            }
            // search for tickets
            const tickets = await Ticket.findAll({
                where: options
            })
            if (!tickets.length) {
                throw errorType("TicketNotFound","Ticket not found")
            }
            res.status(201).send(tickets)
        }
        catch (err) {
            errorHandler(res, err, "Unable to find ticket")
        }
    },
    /* 
    Update state of a ticket
    Permission: {
        1: Can update tickets in all project
        2: Can update tickets in managed project
        3-4: Can update owned tickets
    }
    params {
        idTicket: Ticket id (required)
    }
    */
    async updateState(req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            const ticket = await Ticket.findByPk(parseInt(req.params.idTicket))
            if (!ticket) {
                throw errorType("TicketNotFound","Ticket not found")
            }
        }
        catch (err) {
            errorHandler(res, err, "Cannot update the state of this ticket")
        }
    }
}