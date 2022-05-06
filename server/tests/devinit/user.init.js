const { User } = require('../../src/database/models')

const user = {
    admin: {
        id: 1,
        name: "Administrator",
        email: "abc@def.com",
        password: "pCFbR3d9yMRuZfn_",
        role: 1
    },
    manager: {
        id: 2,
        name: "Project Manager",
        email: "abcde@yahoo.com",
        password: "Sdf(123)",
        role: 2
    },
    dev: {
        id: 3,
        name: "Developer",
        email: "abc@yahoo.com",
        password: "Sdf(123)",
        role: 3
    },
    submittor: {
        id: 4,
        name: "Submittor",
        email: "abcd@yahoo.com",
        password: "Sdf(123)",
        role: 4
    }
}

User.findOrCreate({
    where: {id: user.admin.id},
    defaults: user.admin
})

User.findOrCreate({
    where: {id: user.manager.id},
    defaults: user.manager
})

User.findOrCreate({
    where: {id: user.dev.id},
    defaults: user.dev
})

User.findOrCreate({
    where: {id: user.submittor.id},
    defaults: user.submittor
})

User.update(user.admin, {
    where: {
        id: user.admin.id
    },
    individualHooks: true
})
User.update(user.manager, {
    where: {
        id: user.manager.id
    },
    individualHooks: true
})
User.update(user.dev, {
    where: {
        id: user.dev.id
    },
    individualHooks: true
})
User.update(user.submittor, {
    where: {
        id: user.submittor.id
    },
    individualHooks: true
})

module.exports = user