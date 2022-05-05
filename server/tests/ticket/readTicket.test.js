const { assert } = require('chai')
const { readProject, readUser } = require('../../src/controllers/TicketController')
const { Request, Response } = require('../ReqRes')
const user = require('../devinit/user.init')
const runLogin = require('../Login')

describe("Administrator user", async function() {
    const req = new Request()
    it("Login as admin", async function() {
        req.body = {
            email: user.admin.email,
            password: user.admin.password
        }
        await runLogin(req, user.admin.name)
    })
    describe("Admin opens a ticket in a project", async function () {
        it("Read all tickets in project 25", async function() {
            await runReadProject(req, 25, 201)
        })
        it("Read all tickets in project 28, should fail and get 404", async function() {
            await runReadProject(req, 28, 404)
        })
        it("Read all tickets of user 1", async function() {
            await runReadUser(req, 1, 201)
        })
        it("Read all tickets of user 42069, should fail and get 404", async function() {
            await runReadUser(req, 42069, 404)
        })
    })
})

async function runReadProject(request, idproject, statusCode) {
    request.params["idProject"] = idproject
    const res = new Response()

    await readProject(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if (statusCode == 201) {
        const keys = Object.keys(res.data)
        for (let key of keys) {
            if (key == "status") continue
            let ticket = res.data[key]
            assert.equal(ticket.idProject, request.params.idProject, `Project id should be ${request.params.idProject}, but got ${ticket.idProject}`)
        }
    }
}

async function runReadUser(request, iduser, statusCode) {
    request.params["idUser"] = iduser
    const res = new Response()

    await readUser(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if (statusCode == 201) {
        const keys = Object.keys(res.data)
        for (let key of keys) {
            if (key == "status") continue
            let ticket = res.data[key]
            assert.equal(ticket.issueByUser, request.params.idUser, `Project id should be ${request.params.idUser}, but got ${ticket.issueByUser}`)
        }
    }
}