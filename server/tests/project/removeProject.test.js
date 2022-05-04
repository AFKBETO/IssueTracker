const { assert } = require('chai')
const { remove } = require('../../src/controllers/ProjectController.js')
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
        it("Delete project 13", async function() {
            await runRemove(req, 13, 204)
        })
    })
})

describe("Manager user", async function() {
    const req = new Request()
    it("Login as manager", async function() {
        req.body = {
            email: user.manager.email,
            password: user.manager.password
        }
        await runLogin(req, user.manager.name)
    })
    describe("Manager working on project", async function () {
        it("Remove project 14, should fail and get 403", async function() {
            await runRemove(req, 14, 403)
        })
    })
})

async function runRemove(request, projectid, statusCode) {
    request.params["projectId"] = projectid
    const res = new Response()
    await remove(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
}