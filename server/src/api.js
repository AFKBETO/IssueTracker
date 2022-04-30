const express = require('express')
const router = express.Router()

router.post('/register', (req, res) => {
  res.send({
      message: `Hello, your email is ${req.body.email} and your password is ${req.body.password}!`
  })
})

module.exports = router