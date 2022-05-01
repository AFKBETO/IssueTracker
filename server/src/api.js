const express = require('express')
const router = express.Router()
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

router.post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register)

module.exports = router