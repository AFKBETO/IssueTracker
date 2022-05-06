const bcrypt = require('bcrypt')


async function hashPassword (user, options) {
    const SALT_FACTOR = 8

    if (!user.changed('password')) {
        return
    }

    const hashedpassword = await bcrypt.hash(user.password, SALT_FACTOR)
    user.setDataValue('password', hashedpassword)
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles',
                key: 'id'
            }
        }
    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    }, {
        paranoid: true,
    })
    
    User.prototype.comparePassword = async function (password) {
        const result = await bcrypt.compare(password, this.password)
        return result
    }

    return User
}