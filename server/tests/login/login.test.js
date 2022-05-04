const { Request } = require('../ReqRes')
const user = require('../devinit/user.init')
const runLogin = require('../Login')

describe("Login test", async function() {
    it("Login as admin", async function() {
        const req = new Request()
        req.body = {
            email: user.admin.email,
            password: user.admin.password
        }
        runLogin(req, user.admin.name)
    })
    it("Login as manager", async function() {
        const req = new Request()
        req.body = {
            email: user.manager.email,
            password: user.manager.password
        }
        runLogin(req, user.manager.name)
    })
    it("Login as developer", async function() {
        const req = new Request()
        req.body = {
            email: user.dev.email,
            password: user.dev.password
        }
        runLogin(req, user.dev.name)
    })
    it("Login as submittor", async function() {
        const req = new Request()
        req.body = {
            email: user.submittor.email,
            password: user.submittor.password
        }
        runLogin(req, user.submittor.name)
    })
})