export function errorHandler(err) {
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
            error.status = 404
            break
        default:
            error.status = 500
            break
    }
    return error
}