const { assert } = require('chai')
const { create } = require('../../src/controllers/TicketController')
const { Request, Response } = require('../ReqRes')
const user = require('../devinit/user.init')
const runLogin = require('../Login')

describe("Administrator user", async function() {
    const req = new Request()
    it("Login as admin", async function() {
        req.body = req.admin
        await runLogin(req, user.admin.name)
    })
    describe("Admin opens a ticket in a project", async function () {
        it("Opening a ticket in project 25", async function() {
            req.body = {
                issueByUser: user.admin.id,
                idProject: 25,
                name: "AdminBug",
                description: "A bug caused by admin"
            }
            await runCreate(req, 201)
        })
        it("Opening a ticket in project 27, should fail and get 403", async function() {
            req.body = {
                issueByUser: user.admin.id,
                idProject: 27,
                name: "AdminBug2",
                description: "Another bug caused by admin"
            }
            await runCreate(req, 403)
        })
    })
})

describe("Submittor user", async function() {
    const req = new Request()
    it("Login as submittor", async function() {
        req.body = user.submittor
        await runLogin(req, user.submittor.name)
    })
    describe("Admin opens a ticket in a project", async function () {
        it("Opening a ticket in project 25", async function() {
            req.body = {
                issueByUser: user.submittor.id,
                idProject: 25,
                name: "SubmittorBug",
                description: "A bug caused by submittor"
            }
            await runCreate(req, 201)
        })
        it("Opening a ticket in project 26, should fail and get 403", async function() {
            req.body = {
                issueByUser: user.submittor.id,
                idProject: 26,
                name: "SubmittorBug2",
                description: "Another bug caused by submittor"
            }
            await runCreate(req, 403)
        })
    })
})

async function runCreate(request, statusCode) {
    
    const res = new Response()

    await create(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if (statusCode == 201) {
        const ticket = res.data.dataValues
        assert.equal(ticket.idProject, request.body.idProject, `Project id should be ${request.body.idProject}, but got ${ticket.idProject}`)
        assert.equal(ticket.issueByUser, request.body.issueByUser, `User id should be ${request.body.issueByUser}, but got ${ticket.issueByUser}`)
        assert.isTrue(ticket.active, `New ticket should be active (true), but got false instead.`)
    }

}