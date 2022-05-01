const {User} = require('../database/models')

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
            if (!user || password != user.password) {
                return res.status(403).send({
                    error: "Email and/or password incorrect"
                })
            }
            
            res.status(200).send(user.toJSON())
            
        }
        catch (err) {
            res.status(500).send({
                error: `Invalid login information.`
            })
        }
    }
}