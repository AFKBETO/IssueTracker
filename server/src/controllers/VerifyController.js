const jwt = require('jsonwebtoken')
const config = require('../database/config/config')

module.exports = {
    jwtVerifyUser (req, role) {
        const [type, token] = req.headers.authorization.split(' ')
        if (type == "Bearer") {
            if (token) {
                try {
                    const decoded = jwt.verify(token, config.authentication.jwtSecret)
                    if (decoded.role < 1 || decoded.role > 4) {
                        const e = Error("Role invalid.")
                        e.name = "InvalidRole"
                        throw e
                    }
                    if (decoded.role <= role) {
                        return decoded
                    }
                    if (decoded.role > role) {
                        const e = new Error("You are not authorized for this action.")
                        e.name = "UnauthorizedAction"
                        throw e
                    }
                }
                catch (err) {
                    throw err
                }
            }
            if (!token) {
                const e = new Error("Token not found.")
                e.name = "NoToken"
                throw e
            }
        }
        if (type != "Bearer") {
            const e = new Error("Wrong authentication type")
            e.name = "WrongAuthType"
            throw e
        }
    }
}