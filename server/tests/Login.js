const { Response } = require('./ReqRes')
const config = require('../src/database/config/config')
const jwt = require('jsonwebtoken')
const { login } = require('../src/controllers/AuthenticationController.js')

async function runLogin(request, username) {
    const res = new Response()
    await login(request, res)
    assert.equal(res.data.status, 200, `Status code should be 200, but got ${res.data.status}: ${res.data.error}`)
    const decoded = jwt.verify(res.data.token, config.authentication.jwtSecret)
    assert.equal(decoded.name, username,`I should be logging in as ${username}, but got ${decoded.name}`)
    request.headers["authorization"] = `Bearer ${res.data.token}`
}

module.exports = runLogin