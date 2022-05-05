const jwt = require('jsonwebtoken')
const config = require('../database/config/config')
const { errorType } = require('./ErrorHandler')

module.exports = {
    jwtVerifyUser (req, role) {
        const [type, token] = req.headers.authorization.split(' ')
        if (type == "Bearer") {
            if (token) {
                try {
                    const decoded = jwt.verify(token, config.authentication.jwtSecret)
                    if (decoded.role < 1 || decoded.role > 4) {
                        throw errorType("InvalidRole", "Role invalid.")
                    }
                    if (decoded.role <= role) {
                        return decoded
                    }
                    if (decoded.role > role) {
                        throw errorType("UnauthorizedAction", "You are not authorized for this action.")
                    }
                }
                catch (err) {
                    throw err
                }
            }
            if (!token) {
                throw errorType("NoToken","Token not found.")
            }
        }
        if (type != "Bearer") {
            throw errorType("WrongAuthType","Wrong authentication type")
        }
    }
}