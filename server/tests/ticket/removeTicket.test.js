const { assert } = require('chai')
const { remove } = require('../../src/controllers/TicketController')
const { Request, Response } = require('../ReqRes')
const user = require('../devinit/user.init')
const runLogin = require('../Login')

describe("Administrator user", async function() {
    const req = new Request()
    it("Login as admin", async function() {
        req.body = user.admin
        await runLogin(req, user.admin.name)
    })
    describe("Admin deletes a ticket", async function () {
        it("Delete ticket 5", async function() {
            await runRemove(req, 5, 204)
        })
    })
})

describe("Manager user", async function() {
    const req = new Request()
    it("Login as manager", async function() {
        req.body = user.manager
        await runLogin(req, user.manager.name)
    })
    describe("Manager deletes a ticket", async function () {
        it("Delete ticket 11", async function() {
            await runRemove(req, 11, 204)
        })
        it("Delete ticket 3", async function() {
            await runRemove(req, 3, 204)
        })
        it("Delete ticket 4, should fail and get 403", async function() {
            await runRemove(req, 4, 403)
        })
    })
})

describe("Dev user", async function() {
    const req = new Request()
    it("Login as developer", async function() {
        req.body = user.dev
        await runLogin(req, user.dev.name)
    })
    describe("Dev deletes a ticket", async function () {
        it("Delete ticket 7", async function() {
            await runRemove(req, 7, 204)
        })
        it("Delete ticket 10, should fail and get 403", async function() {
            await runRemove(req, 4, 403)
        })
    })
})

async function runRemove(request, idticket, statusCode) {
    request.params["idTicket"] = idticket
    const res = new Response()

    await remove(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
}