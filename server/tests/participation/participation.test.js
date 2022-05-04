const { assert } = require('chai')
const { create, read, remove } = require('../../src/controllers/ParticipationController')
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
    describe("Admin assigns new participant", async function () {
        it("Assigning user 4 to project 7 owned by 1", async function() {
            await runCreate(req, 7, 4, 201)
        })
        it("Assigning user 3 to project 10 owned by 2", async function() {
            await runCreate(req, 10, 3, 201)
        })
    })
    describe("Admin reads all projects from a participant", async function () {
        it("Reading all from user 1", async function() {
            await runRead(req, 1, 200)
        })
        it("Reading all from user 2", async function() {
            await runRead(req, 2, 200)
        })
        it("Reading all from user 3", async function() {
            await runRead(req, 3, 200)
        })
    })
    describe("Admin removes participant from project", async function () {
        it("Removing user 4 from project 7 owned by 1", async function() {
            await runRemove(req, 7, 4, 204)
        })
        it("Removing user 3 from project 10 owned by 2", async function() {
            await runRemove(req, 10, 3, 204)
        })
        it("Removing user 2 from project 10 owned by 2, should fail and get 400", async function() {
            await runRemove(req, 10, 2, 400)
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
    describe("Manager assigns new participant", async function () {
        it("Assigning user 4 to project 7 owned by 1, should fail and get 403.", async function() {
            await runCreate(req, 7, 4, 403)
        })
        it("Assigning user 3 to project 10 owned by 2", async function() {
            await runCreate(req, 10, 3, 201)
        })
    })
    describe("Manager reads all projects from a participant", async function () {
        it("Reading all from user 1, should fail and get 403", async function() {
            await runRead(req, 1, 403)
        })
        it("Reading all from user 2", async function() {
            await runRead(req, 2, 200)
        })
        it("Reading all from user 3, should fail and get 403", async function() {
            await runRead(req, 3, 403)
        })
    })
    describe("Manager removes participant from project", async function () {
        it("Removing user 4 from project 7 owned by 1, should fail and get 403.", async function() {
            await runRemove(req, 7, 4, 403)
        })
        it("Removing user 3 from project 10 owned by 2", async function() {
            await runRemove(req, 10, 3, 204)
        })
        it("Removing user 2 from project 10 owned by 2, should fail and get 400", async function() {
            await runRemove(req, 10, 2, 400)
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
    describe("Dev assigns new participant", async function () {
        it("Assigning user 4 to project 7 owned by 1, should fail and get 403.", async function() {
            await runCreate(req, 7, 4, 403)
        })
    })
    describe("Dev reads all projects from a participant", async function () {
        it("Reading all from user 1, should fail and get 403", async function() {
            await runRead(req, 1, 403)
        })
        it("Reading all from user 2, should fail and get 403", async function() {
            await runRead(req, 2, 403)
        })
        it("Reading all from user 3", async function() {
            await runRead(req, 3, 200)
        })
    })
    describe("Dev removes participant from project", async function () {
        it("Removing user 4 from project 7 owned by 1, should fail and get 403.", async function() {
            await runRemove(req, 7, 4, 403)
        })
    })
})

describe("Submittor user", async function() {
    const req = new Request()
    it("Login as dev", async function() {
        req.body = {
            email: user.submittor.email,
            password: user.submittor.password
        }
        await runLogin(req, user.submittor.name)
    })
    describe("Dev assigns new participant", async function () {
        it("Assigning user 4 to project 7 owned by 1, should fail and get 403.", async function() {
            await runCreate(req, 7, 4, 403)
        })
    })
    describe("Dev reads all projects from a participant", async function () {
        it("Reading all from user 1, should fail and get 403", async function() {
            await runRead(req, 1, 403)
        })
        it("Reading all from user 2, should fail and get 403", async function() {
            await runRead(req, 2, 403)
        })
        it("Reading all from user 4", async function() {
            await runRead(req, 4, 200)
        })
    })
    describe("Dev removes participant from project", async function () {
        it("Removing user 4 from project 7 owned by 1, should fail and get 403.", async function() {
            await runRemove(req, 7, 4, 403)
        })
    })
})


async function runCreate(request, projectid, userid, statusCode) {
    request.body["projectId"] = projectid
    request.body["userId"] = userid
    
    const res = new Response()

    await create(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    const participant = res.data.dataValues
    if (statusCode == 201) {
        assert.equal(participant.ProjectId, request.body.projectId, `Project id should be ${request.body.projectId}, but got ${participant.ProjectId}`)
        assert.equal(participant.UserId, request.body.userId, `User id should be ${request.body.userId}, but got ${participant.UserId}`)
    }
}

async function runRead(request, userid, statusCode) {
    request.params["userId"] = userid
    
    const res = new Response()

    await read(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
    if (statusCode == 200) {
        const keys = Object.keys(res.data)
        for (let key of keys) {
            if (key == "status") continue
            let project = res.data[key]
            assert.equal(project.Participation.UserId, userid, `User id should be ${userid}, but got ${project.Participation.UserId}`)
        }
    }
}

async function runRemove(request, projectid, userid, statusCode) {
    request.body["projectId"] = projectid
    request.body["userId"] = userid
    
    const res = new Response()
    await remove(request, res)
    assert.equal(res.data.status, statusCode, `Status code should be ${statusCode}, but got ${res.data.status}: ${res.data.error}`)
}