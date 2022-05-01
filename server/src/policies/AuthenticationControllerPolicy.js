const Joi = require('joi')

module.exports = {
    register(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().pattern(
                new RegExp('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\\W)|(?=.*_))^[^ ]+$')
            )
        })

        const {error, value} = schema.validate(req.body)

        if (error) {
            switch(error.details[0].context.key) {
                case 'email':
                    res.status(400).send({
                        error: `You must provide a valid email address.`
                    })
                    break
                case 'password':
                    res.status(400).send({
                        error: `A password must be 8-32 character long and contain at least:
                        <br> 1. an uppercase letter
                        <br> 2. a lowercase letter
                        <br> 3. a number
                        <br> 4. a special character.`
                    })
                    break
                default:
                    res.status(400).send({
                        error: `Invalid registration information.`
                    })
                    break
            }
        }
        if (!error){
            next()
        }
    }
}