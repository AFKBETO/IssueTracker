const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const apiRouter = require('./src/api.js')

const app = express()
const port = 8081
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req, res) => {
  res.status(200).send({
      message: `Hello, your email is ${req.body.email} and your password is ${req.body.password}!`
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/api/', apiRouter)

console.log("Hello")