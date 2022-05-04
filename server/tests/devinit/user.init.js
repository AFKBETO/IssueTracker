const { User } = require('../../src/database/models')

User.findOrCreate({
    where: {id: "1"},
    defaults: {
        name: "Administrator",
        email: "abc@def.com",
        password: "pCFbR3d9yMRuZfn_",
        role: 1
    }
})

User.findOrCreate({
    where: {id: "2"},
    defaults: {
        name: "Project Manager",
        email: "abcde@yahoo.com",
        password: "Sdf(123)",
        role: 2
    }
})

User.findOrCreate({
    where: {id: "3"},
    defaults: {
        name: "Developper",
        email: "abc@yahoo.com",
        password: "Sdf(123)",
        role: 3
    }
})

User.findOrCreate({
    where: {id: "4"},
    defaults: {
        name: "Submittor",
        email: "abcd@yahoo.com",
        password: "Sdf(123)",
        role: 4
    }
})