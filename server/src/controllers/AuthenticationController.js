const {User} = require('../database/models')
const jwt = require('jsonwebtoken')
const config = require('../database/config/config')

function jwtSignUser(user){
    const ONE_HOUR = 60*60
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_HOUR
    })
}

module.exports = {
    async register (req, res) {
        try {
            const user = await User.create(req.body)
            res.status(200).send(user.toJSON())
        }
        catch (err) {
            res.status(400).send({
                error: `This email is already in use.`
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
                return res.status(403).send({
                    error: "Email and/or password incorrect"
                })
            }
            
            res.status(200).send({
                user: user.toJSON(),
                token: jwtSignUser(user.toJSON())
            })
            
        }
        catch (err) {
            res.status(500).send({
                error: `Invalid login information.`
            })
        }
    }
}