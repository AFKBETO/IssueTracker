const { User } = require('../database/models')
const jwt = require('jsonwebtoken')
const config = require('../database/config/config')
const { errorHandler, errorType } = require('./ErrorHandler')

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
            errorHandler(res, new Error(`This email is already in use.`), "Error")
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
                throw errorType("WrongLogin", "Email and/or password incorrect.")
            }
            
            res.status(200).send({
                token: jwtSignUser(user.toJSON())
            })
            
        }
        catch (err) {
            errorHandler(res, err, "Invalid login information")
        }
    }
}