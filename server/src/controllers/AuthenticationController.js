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
        
    }
}