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
    Update data of a ticket
    Permission: {
        1: Can update tickets in all project
        2: Can update tickets in managed project
        3-4: Can update owned tickets
    }
    params {
        idTicket: Ticket id (required)
    }
    body {
        name: Ticket name (not empty),
        description: Ticket description,
        active: Ticket's status
    }
    */
    async update(req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            const ticket = await checkTicket(decoded,parseInt(req.params.idTicket))
            if (!ticket) {
                throw errorType("TicketNotFound","Ticket not found")
            }
            ticket.set({
                active: !(!req.body.active),
                name: req.body.name,
                description: req.body.description
            })
            await ticket.save()
            res.status(201).send(ticket)
        }
        catch (err) {
            errorHandler(res, err, "Cannot update data of this ticket")
        }
    },
    /* 
    Delete a ticket
    Permission: {
        1: Can delete tickets in all project
        2: Can delete tickets in managed project
        3-4: Can delete owned tickets
    }
    params {
        idTicket: Ticket id (required)
    }
    */
    async remove(req, res) {
        try {
            const decoded = jwtVerifyUser(req, 4)
            await checkTicket(decoded,parseInt(req.params.idTicket))
            await Ticket.destroy({
                where: {
                    id: parseInt(req.params.idTicket)
                }
            })
            res.status(204).send({
                message: "The ticket has been removed."
            })
        }
        catch (err) {
            errorHandler(res, err, "Cannot remove this ticket")
        }
    }
}

async function checkTicket(decodedData, idTicket) {
    const ticket = await Ticket.findByPk(idTicket)
    if (ticket && decodedData.role > 1) {
        if (decodedData.id != ticket.issueByUser) {
            if (decodedData.role == 2) {
                const project = await Project.findByPk(ticket.idProject)
                if (project.manageByUser != decodedData.id) {
                    throw errorType("UnauthorizedAction", "You are not authorized for this action")
                }
            }
            if (decodedData.role > 2) {
                throw errorType("UnauthorizedAction", "You are not authorized for this action")
            }
        }
    }
    return ticket
}