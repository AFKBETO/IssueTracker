const { User } = require('@/src/database/models')
const { login } = require('@/src/controllers/AuthenticationController.js')
const { jwtVerifyUser } = require('@/src/controllers/VerifyController')

it("Should login as admin", () => {
    var req = {
        body: {
            email: ""
        }
    }
})