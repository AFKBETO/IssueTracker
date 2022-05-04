const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

fs
    .readdirSync(__dirname)
    .filter((file) => 
        file != "index.js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })


db['Project'].hasMany(db['Ticket'],{
    onDelete: 'CASCADE'
})
db['Ticket'].belongsTo(db['Project'])
db['User'].hasMany(db['Ticket'], {
    onDelete: 'CASCADE'
})
db['Ticket'].belongsTo(db['User'])
db['Project'].belongsToMany(db['User'], { through: db['Participation'] })
db['User'].belongsToMany(db['Project'], { through: db['Participation'] })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db