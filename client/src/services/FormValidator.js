export function passwordValidator(password) {
    const errors = []
    if (!/\d+/.test(password)) {
        errors.push({message: "Password needs at least 1 number (0-9)."})
    }
    if (!/[a-z]+/.test(password)) {
        errors.push({message: "Password needs at least 1 lowercase character."})
    }
    if (!/[A-Z]+/.test(password)) {
        errors.push({message: "Password needs at least 1 uppercase character."})
    }
    if (!/(\W)|(_)+/.test(password)) {
        errors.push({message: "Password needs at least 1 special character."})
    }
    if (!/[\s\S]{8,32}/.test(password)){
        errors.push({message: "Password must be 8-32 character long."})
    }
    if (!/^[^ ]+/.test(password)) {
        errors.push({message: "Password must not start with a whitespace."})
    }
    return errors
}

export function emailValidator(email) {
    if (!/^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return true
    return false
}