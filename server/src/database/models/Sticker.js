module.exports = (sequelize, DataTypes) => {
    const Sticker = sequelize.define('Sticker', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        issueByUser: {
            type: DataTypes.INTEGER
        },
        idProject: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING,
        }
    })

    return Sticker
}