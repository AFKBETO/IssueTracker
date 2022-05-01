module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Sticker', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        manageByUser: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING,
        }
    })

    return Project
}