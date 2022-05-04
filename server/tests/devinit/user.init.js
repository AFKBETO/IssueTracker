const { User } = require('../../src/database/models')

const user = {
    admin: {
        name: "Administrator",
        email: "abc@def.com",
        password: "pCFbR3d9yMRuZfn_",
        role: 1
    },
    manager: {
        name: "Project Manager",
        email: "abcde@yahoo.com",
        password: "Sdf(123)",
        role: 2
    },
    dev: {
        name: "Developer",
        email: "abc@yahoo.com",
        password: "Sdf(123)",
        role: 3
    },
    submittor: {
        name: "Submittor",
        email: "abcd@yahoo.com",
        password: "Sdf(123)",
        role: 4
    }
}

User.findOrCreate({
    where: {id: "1"},
    defaults: user.admin
})

User.findOrCreate({
    where: {id: "2"},
    defaults: user.manager
})

User.findOrCreate({
    where: {id: "3"},
    defaults: user.dev
})

User.findOrCreate({
    where: {id: "4"},
    defaults: user.submittor
})

module.exports = user