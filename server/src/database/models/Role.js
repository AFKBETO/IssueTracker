module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
        }
    })

    Role.findOrCreate({
        where: {id: "1"},
        defaults: {
            description: "Administrator"
        }
    })
    Role.findOrCreate({
        where: {id: "2"},
        defaults: {
            description: "Project Manager"
        }
    })
    Role.findOrCreate({
        where: {id: "3"},
        defaults: {
            description: "Developper"
        }
    })
    Role.findOrCreate({
        where: {id: "4"},
        defaults: {
            description: "Submittor"
        }
    })

    return Role
}