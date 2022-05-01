const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const apiRouter = require('./api.js')
const {sequelize} = require('./database/models')
const config = require('./database/config/config')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req, res) => {
  res.status(200).send({
      message: `Hello, your email is ${req.body.email} and your password is ${req.body.password}!`
  })
})

app.use('/api/', apiRouter)

sequelize.sync()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  })

console.log("Hello")