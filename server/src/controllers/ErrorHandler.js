/*
this function embeds error status into the error message
*/

module.exports = {
    errorHandler(err) {
        const error = {
            status: 400,
            message: err.message
        }
        switch (err.name) {
            case "TokenExpiredError":
                error.status = 401
                error.message = "Your session has expired."
                break
            case "InvalidRole":
            case "UnauthorizedAction":
            case "WrongLogin":
                error.status = 403
                break
            case "UserNotFound":
            case "ProjectNotFound":
                error.status = 404
                break
            case "ParticipantAlreadyAssigned":
            case "JsonWebTokenError":
            case "NotBeforeError":
                error.status = 500
                break
            default:
                break
        }
        return error
    }
}