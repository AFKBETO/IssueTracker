const { User } = require('../../src/database/models')
const { login } =require('../../src/controllers/AuthenticationController.js')
const jwt = require('jsonwebtoken')
const Response = require('../response')
const config = require('../../src/database/config/config')

const req = {
    body: {
        email: "abc@def.com",
        password: "pCFbR3d9yMRuZfn_"
    }
}
const res = new Response()
login(req, res)
console.log(res)