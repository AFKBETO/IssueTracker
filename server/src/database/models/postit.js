module.exports = (sequelize, DataTypes) => {
    const postit = sequelize.define('postit', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        issueByUser: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        idProject: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projects',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        },
        description: {
            type: DataTypes.TEXT,
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    })

    return postit
}