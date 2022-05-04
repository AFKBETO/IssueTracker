const { expect, assert } = require('chai')
const { User, Project } = require('../../src/database/models')
const { login } = require('../../src/controllers/AuthenticationController.js')
const ProjectController = require('../../src/controllers/ProjectController.js')
const jwt = require('jsonwebtoken')
const Response = require('../response')
const config = require('../../src/database/config/config')


describe("Administrator user", async function() {
    const req = {
        headers : {},
        params : {},
        body: {
            email: "abc@def.com",
            password: "pCFbR3d9yMRuZfn_"
        }
    }
    it("Login as admin", async function() {
        const res = new Response()
        await login(req, res)
        assert.equal(res.data.status, 200, `Status code should be 200, but got ${res.data.status}`)
        const decoded = jwt.verify(res.data.token, config.authentication.jwtSecret)
        assert.equal(decoded.name, "Administrator",`I should be logging in as Administrator, but got ${decoded.name}`)
        req.headers["authorization"] = `Bearer ${res.data.token}`
    }),
    describe("Admin working on project", async function () {
        it("Create a new project for self", async function() {
            req.body = {
                name: "ProjectAdmin",
                description: "A project managed by admin"
            }
            const res = new Response()

            await ProjectController.create(req, res)
            assert.equal(res.data.status, 201, `Status code should be 201, but got ${res.data.status}: ${res.data.error}`)
            const project = res.data.dataValues
            assert.equal(project.name, req.body.name, `Project name should be ${req.body.name}, but got ${project.name}`)
            assert.equal(project.manageByUser, 1, `Manager should be 1, but got ${project.manageByUser}`)
            assert.equal(project.description, req.body.description, `Manager should be ${req.body.description}, but got ${project.description}`)
        })
        it("Create a new project for a manager", async function() {
            req.body = {
                name: "ProjectManager",
                manageByUser: 2,
                description: "A project managed by manager"
            }
            const res = new Response()
            await ProjectController.create(req, res)
            assert.equal(res.data.status, 201, `Status code should be 201, but got ${res.data.status}: ${res.data.error}`)
            const project = res.data.dataValues
            assert.equal(project.name, req.body.name, `Project name should be ${req.body.name}, but got ${project.name}`)
            assert.equal(project.manageByUser, req.body.manageByUser, `Manager should be ${req.body.manageByUser}, but got ${project.manageByUser}`)
            assert.equal(project.description, req.body.description, `Manager should be ${req.body.description}, but got ${project.description}`)
        })
        it("Create a new project for a non-manager, should fail", async function() {
            req.body = {
                name: "ProjectDev",
                manageByUser: 3,
                description: "A project managed by a dev"
            }
            const res = new Response()
            await ProjectController.create(req, res)
            assert.equal(res.data.status, 400, `Status code should be 400, but got ${res.data.status}: ${res.data.error || res.data.dataValues}`)
        })
    })
    

})
