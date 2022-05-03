/*
this function embeds error status into the error message
*/

module.exports = {
    errorHandler(res, err, message) {
        const error = {
            status: 400,
            message: err.message
        }
        switch (err.name) {
            case "SequelizeUniqueConstraintError":
                error.message = "Duplicated creation."
                break    
            case "TokenExpiredError":
                error.status = 401
                error.message = "Your session has expired."
                break
            case "InvalidRole":
            case "UnauthorizedAction":
            case "WrongLogin":
                error.status = 403
                break
            case "SequelizeForeignKeyConstraintError":
                error.message = "At least one parameter is invalid."
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
        res.status(error.status).send({
            error: `${message}: ${error.message}`
        })
    }
}