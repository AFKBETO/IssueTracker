const { assert } = require('chai')
const { read, update } = require('../../src/controllers/ProjectController.js')
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
        it("Change project 1", async function() {
            req.body["name"] = "ProjectAdmin1"
            req.body["manageByUser"] = 1
            req.body["description"] = "Project 1 of admin"
            await runUpdate(req, 1, 200)
        })
        it("Assign project 2 to non-manager user, should fail and get 400", async function() {
            req.body = {}
            req.body["manageByUser"] = 3
            await runUpdate(req, 2, 400)
        })
        it("Assign project 3 to ghost user, should fail and get 404", async function() {
            req.body = {}
            req.body["manageByUser"] = 42069
            await runUpdate(req, 3, 404)
        })
        it("Modify nothing, should get 400", async function() {
            req.body = {}
            await runUpdate(req, 4, 400)
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
        it("Change project 1, should fail and get 404", async function() {
            req.body["name"] = "ProjectManager1"
            req.body["manageByUser"] = 2
            req.body["description"] = "Project 1 of manager"
            await runUpdate(req, 1, 404)
        })
        it("Assign project 3 to admin, should fail and get 403", async function() {
            req.body = {}
            req.body["manageByUser"] = 1
            await runUpdate(req, 3, 400)
        })
        it("Modify project 3", async function() {
            req.body = {}
            req.body["name"] = "Hello world!"
            req.body["manageByUser"] = 42069
            await runUpdate(req, 3, 200)
        })
    })
})

describe("Dev user", async function() {
    const req = new Request()
    it("Login as dev", async function() {
        req.body = {
            email: user.dev.email,
            password: user.dev.password
        }
        await runLogin(req, user.dev.name)
    })
    describe("Dev working on project", async function () {
        it("Change project 1, should fail and get 403", async function() {
            req.body["name"] = "ProjectManager1"
            req.body["manageByUser"] = 2
            req.body["description"] = "Project 1 of manager"
            await runUpdate(req, 1, 403)
        })
    })
})

async function runUpdate(request, projectid, statusCode) {
    request.params["projectId"] = projectid
    const res = new Response()
    await update(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    const project = res.data.dataValues
    if (statusCode == 201) {
        assert.equal(project.name, request.body.name, `Project name should be ${request.body.name}, but got ${project.name}`)
        if(request.body.manageByUser) assert.equal(project.manageByUser, request.body.manageByUser, `Manager should be ${manageByUser}, but got ${project.manageByUser}`)
        assert.equal(project.description, request.body.description, `Manager should be ${request.body.description}, but got ${project.description}`)
    }
}