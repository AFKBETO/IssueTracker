const { assert } = require('chai')
const { update, readUser } = require('../../src/controllers/TicketController')
const { Request, Response } = require('../ReqRes')
const user = require('../devinit/user.init')
const runLogin = require('../Login')

describe("Administrator user", async function() {
    const req = new Request()
    it("Login as admin", async function() {
        req.body = user.admin
        await runLogin(req, user.admin.name)
    })
    describe("Admin changes a ticket", async function () {
        it("Switch ticket 1", async function() {
            req.body = {
                name: "NewIssue",
                description: "A new issue",
                active: false
            }
            await runUpdate(req, 1, 201)
        })
    })
})

describe("Manager user", async function() {
    const req = new Request()
    it("Login as manager", async function() {
        req.body = user.manager
        await runLogin(req, user.manager.name)
    })
    describe("Manager changes a ticket", async function () {
        it("Switch ticket 10 issued by 2", async function() {
            req.body = {
                name: "ManagerIssue",
                description: "An issue with manager",
                active: false
            }
            await runUpdate(req, 10, 201)
        })
        it("Switch ticket 8 issued by 3", async function() {
            req.body = {
                name: "DevIssue",
                description: "An issue with dev",
                active: true
            }
            await runUpdate(req, 8, 201)
        })
        it("Switch ticket 4 issued by 4, should fail and get 403", async function() {
            req.body = {
                name: "Submittor issue",
                description: "An issue with submittor",
                active: true
            }
            await runUpdate(req, 4, 403)
        })
    })
})

describe("Dev user", async function() {
    const req = new Request()
    it("Login as developer", async function() {
        req.body = user.dev
        await runLogin(req, user.dev.name)
    })
    describe("Dev changes a ticket", async function () {
        it("Switch ticket 10 issued by 2, should fail and get 403", async function() {
            req.body = {
                name: "DevIssue2",
                description: "An issue with dev2",
                active: true
            }
            await runUpdate(req, 10, 403)
        })
        it("Switch ticket 8 issued by 3", async function() {
            req.body = {
                name: "DevIssue",
                description: "An issue with dev",
                active: false
            }
            await runUpdate(req, 8, 201)
        })
    })
})

describe("Submittor user", async function() {
    const req = new Request()
    it("Login as developer", async function() {
        req.body = user.submittor
        await runLogin(req, user.submittor.name)
    })
    describe("Dev changes a ticket", async function () {
        it("Switch ticket 4 issued by 4", async function() {
            req.body = {
                name: "SubmitIssue",
                description: "An issue with submittor",
                active: false
            }
            await runUpdate(req, 4, 201)
        })
        it("Switch ticket 6 issued by 4", async function() {
            req.body = {
                name: "SubmitIssue2",
                description: "Another issue with submittor",
                active: true
            }
            await runUpdate(req, 6, 201)
        })
        it("Switch ticket 8 issued by 3, should fail and get 403", async function() {
            req.body = {
                name: "SubmitIssue3",
                description: "Another (!) issue with submittor",
                active: true
            }
            await runUpdate(req, 8, 403)
        })
    })
})

async function runUpdate(request, idticket, statusCode) {
    request.params["idTicket"] = idticket
    const res = new Response()

    await update(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if (statusCode == 201) {
        const ticket = res.data.dataValues
        assert.equal(ticket.id, request.params.idTicket, `Ticket id should be ${request.params.idTicket}, but got ${ticket.id}`)
        if (request.body.name) assert.equal(ticket.name, request.body.name, `name should be ${request.body.name}, but got ${ticket.name}`)
        if (request.body.description) assert.equal(ticket.description, request.body.description, `name should be ${request.body.description}, but got ${ticket.description}`)
    }
}