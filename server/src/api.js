const express = require('express')
const router = express.Router()
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const ProjectController = require('./controllers/ProjectController')
const PartipationController = require('./controllers/ParticipationController')
const TicketController = require('./controllers/TicketController')

router.post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register)
router.post('/login', AuthenticationController.login)

router.post('/project', ProjectController.create)
router.get('/project', ProjectController.read)
router.get('/project/:userId', ProjectController.readAll)
router.patch('/project/:projectId', ProjectController.update)
router.delete('/project/:projectId', ProjectController.remove)

router.post('/participation', PartipationController.create)
router.get('/participation/:userId', PartipationController.read)
router.delete('/participation', PartipationController.remove)

router.post('/ticket', TicketController.create)
router.get('/ticket/project/:idProject', TicketController.readProject)
router.get('/ticket/user/:idUser', TicketController.readUser)

router.get('/token', (req, res) => {
    console.log(req)
})

module.exports = router