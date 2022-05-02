const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))


function hashPassword (user, options) {
    const SALT_FACTOR = 8
  
    if (!user.changed('password')) {
        return
    }
  
    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
        user.setDataValue('password', hash)
    })
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
            beforeUpdate: hashPassword,
            beforeSave: hashPassword
        }
    }, {
        paranoid: true,
    })
    
    User.prototype.comparePassword = function (password) {
        return bcrypt.compareAsync(password, this.password)
    }

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

    return User
}