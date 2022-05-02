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
                error.status = 403
                break
            case "UserNotFound":
            case "ProjectNotFound":
                error.status = 404
                break
            case "ParticipantAlreadyAssigned":
                error.status = 500
                break
            default:
                break
        }
        return error
    }
}