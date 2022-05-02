const express = require('express')
const router = express.Router()
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const ProjectController = require('./controllers/ProjectController')
const PartipationController = require('./controllers/ParticipationController')

router.post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register)
router.post('/login', AuthenticationController.login)

router.post('/project', ProjectController.create)
router.get('/project', ProjectController.read)
router.get('/project/:userId', ProjectController.read)
router.patch('/project/:projectId', ProjectController.update)
router.delete('/project/:projectId', ProjectController.delete)

router.post('/participation', PartipationController.create)
router.get('/participation/:userId', PartipationController.read)

router.get('/token', (req, res) => {
    console.log(req)
})

module.exports = router