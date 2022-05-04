const { assert } = require('chai')
const { create } = require('../../src/controllers/ProjectController.js')
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
        req.body = {
            name: "",
            description: ""
        }
    })
    describe("Admin working on project", async function () {
        it("Create a new project for self", async function() {
            req.body.name = "ProjectAdmin"
            req.body.description = "A project managed by admin"
            await runCreate(req, 0, 201)
        })
        it("Create a new project for a manager", async function() {
            req.body.name = "ProjectManager"
            req.body.description = "A project managed by manager"
            await runCreate(req, 2, 201)
        })
        it("Create a new project for a non-manager, should fail with 400", async function() {
            req.body.name = "ProjectDev"
            req.body.description = "A project managed by a dev"
            await runCreate(req, 3, 400)
        })
        it("Create a new project for a non-user, should fail with 404", async function() {
            req.body.name = "ProjectGhost"
            req.body.description = "A project managed by a ghost"
            await runCreate(req, 69420, 404)
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
        req.body = {
            name: "",
            description: ""
        }
    })
    describe("Manager working on project", async function () {
        req.body.name = "ProjectManager"
        req.body.description = "A project managed by manager"
        it("Create a new project for self", async function() {
            await runCreate(req, 0, 201)
        })
        req.body.name = "ProjectAdmin"
        req.body.description = "A project managed by admin"
        it("Try to create a project for an admin, should be ignored", async function() {
            await runCreateExtra(req, 1, 201, 2)
        })
    })
})

describe("Developer user", async function() {
    const req = new Request()
    it("Login as developer", async function() {
        req.body = {
            email: user.dev.email,
            password: user.dev.password
        }
        await runLogin(req, user.dev.name)
    })
    describe("Developer working on project", async function () {
        req.body = {
            name: "ProjectDev",
            description: "A project managed by a dev"
        }
        it("Create a new project for self, should fail with 403", async function() {
            await runCreate(req, 0, 403)
        })
    })
})

async function runCreateExtra(request, target, statusCode, manageByUser) {
    if (target) {
        request.body["manageByUser"] = target
    }
    const res = new Response()

    await create(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    const project = res.data.dataValues
    if (statusCode == 201) {
        assert.equal(project.name, request.body.name, `Project name should be ${request.body.name}, but got ${project.name}`)
        if(manageByUser) assert.equal(project.manageByUser, manageByUser, `Manager should be ${manageByUser}, but got ${project.manageByUser}`)
        assert.equal(project.description, request.body.description, `Manager should be ${request.body.description}, but got ${project.description}`)
    }
}

async function runCreate(request, target, statusCode) {
    await runCreateExtra(request, target, statusCode, target)
}

