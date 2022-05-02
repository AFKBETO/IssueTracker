const { User } = require('../database/models')
const jwt = require('jsonwebtoken')
const config = require('../database/config/config')
const { errorHandler } = require('./ErrorHandler')

function jwtSignUser(user){
    const ONE_HOUR = 60*60
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_HOUR
    })
}

module.exports = {
    async register (req, res) {
        try {
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: 4
            })
            res.status(200).send(user.toJSON())
        }
        catch (err) {
            const error = errorHandler(new Error(`This email is already in use.`))
            res.status(error.status).send({
                error: error.message
            })
        }
    },
    async login (req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if (!user || !user.comparePassword(password)) {
                const e = new Error("Email and/or password incorrect.")
                e.name = "WrongLogin"
                throw e
            }
            
            res.status(200).send({
                token: jwtSignUser(user.toJSON())
            })
            
        }
        catch (err) {
            const error = errorHandler(err)
            console.log(err)
            res.status(error.status).send({
                error: `Invalid login information: ${error.message}`
            })
        }
    }
}