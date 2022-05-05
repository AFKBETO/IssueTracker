const express = require('express')
const router = express.Router()
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const ProjectController = require('./controllers/ProjectController')
const PartipationController = require('./controllers/ParticipationController')
const TicketController = require('./controllers/TicketController')

router
    .post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register)
    .post('/login', AuthenticationController.login)

router
    .post('/project', ProjectController.create)
    .get('/project', ProjectController.read)
    .get('/project/:userId', ProjectController.readAll)
    .patch('/project/:projectId', ProjectController.update)
    .delete('/project/:projectId', ProjectController.remove)

router
    .post('/participation', PartipationController.create)
    .get('/participation/:userId', PartipationController.read)
    .delete('/participation', PartipationController.remove)

router
    .post('/ticket', TicketController.create)
    .get('/ticket/projects/:idProject', TicketController.readProject)
    .get('/ticket/users/:idUser', TicketController.readUser)
    .patch('/ticket/:idUser', TicketController.update)

module.exports = router