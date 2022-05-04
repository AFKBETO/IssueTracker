const { assert } = require('chai')
const { read } = require('../../src/controllers/ProjectController.js')
const { Response, Request } = require('../ReqRes')
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
    describe("Admin working on project", async function () {
        req.body = {}
        it("Read all projects", async function() {
            await runRead(req, 0, 200)
        })
        it("Read all projects of 1", async function() {
            await runRead(req, 1, 200)
        })
        it("Read all projects of 2", async function() {
            await runRead(req, 2, 200)
        })
        it("Read all projects of 3, should fail and get 404", async function() {
            await runRead(req, 3, 404)
        })
    })
})

describe("Project Manager user", async function() {
    const req = new Request()
    it("Login as manager", async function() {
        req.body = {
            email: user.manager.email,
            password: user.manager.password
        }
        await runLogin(req, user.manager.name)
    })
    describe("Manager working on project", async function () {
        req.body = {}
        it("Read all projects", async function() {
            await runRead(req, 0, 200)
        })
        it("Read all projects of 1, should fail and get 403", async function() {
            await runRead(req, 1, 403)
        })
        it("Read all projects of 2 (self), should fail and get 403 due to wrong route", async function() {
            await runRead(req, 2, 403)
        })
    })
})

describe("Developer user", async function() {
    const req = new Request()
    it("Login as dev", async function() {
        req.body = {
            email: user.dev.email,
            password: user.dev.password
        }
        await runLogin(req, user.dev.name)
    })
    describe("Developer working on project", async function () {
        req.body = {}
        it("Read all projects, should fail and get 403", async function() {
            await runRead(req, 0, 403)
        })
        it("Read all projects of 1, should fail and get 403", async function() {
            await runRead(req, 1, 403)
        })
    })
})

async function runRead(request, userid, statusCode) {
    if (userid) {
        request.params["userId"] = userid
    }
    const res = new Response()
    await read(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if(userid && res.data.status == 200) {
        const keys = Object.keys(res.data)
        for (let key of keys) {
            if (key == "status") continue
            assert.equal(res.data[key].manageByUser, userid, `Should not read projects of other users`)
        }
    }
}
