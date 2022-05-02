const express = require('express')
const router = express.Router()
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const ProjectController = require('./controllers/ProjectController')
const PartipationController = require('./controllers/ParticipationController')

router.post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register)
router.post('/login', AuthenticationController.login)

router.post('/project/create', ProjectController.create)

router.post('/participation/create', PartipationController.create)

router.get('/token', (req, res) => {
    console.log(req)
})

module.exports = router