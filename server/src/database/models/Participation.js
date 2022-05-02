module.exports = (sequelize, DataTypes) => {
    const Participation = sequelize.define('Participation', {
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        ProjectId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projects',
                key: 'id'
            }
        }
    }, {
        paranoid: true,
    })

    return Participation
}