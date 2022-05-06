const { assert } = require('chai')
const { read, readProject } = require('../../src/controllers/ProjectController.js')
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
        it("Read project 1", async function() {
            await runReadProject(req, 1, 200)
        })
        it("Read all projects of 3, should fail and get 403", async function() {
            await runReadProject(req, 3, 403)
        })
        it("Read all projects of self", async function() {
            await runRead(req, user.admin.id, 200)
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
        it("Read all projects of self", async function() {
            await runRead(req, user.manager.id, 200)
        })
        it("Read project 7, should fail and get 403", async function() {
            await runReadProject(req, 7, 403)
        })
        it("Read project 3", async function() {
            await runReadProject(req, 3, 200)
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
            await runRead(req, user.dev.id, 403)
        })
    })
})

async function runRead(request, userid, statusCode) {
    const res = new Response()
    await read(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if(res.data.status == 200) {
        const keys = Object.keys(res.data)
        for (let key of keys) {
            if (key == "status") continue
            assert.equal(res.data[key].manageByUser, userid, `Should not read projects of other users`)
        }
    }
}

async function runReadProject(request, projectid, statusCode) {
    if (projectid) {
        request.params["projectId"] = projectid
    }
    const res = new Response()
    await readProject(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
}
