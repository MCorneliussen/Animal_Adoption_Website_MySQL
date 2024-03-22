module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        FullName: DataTypes.STRING,
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Role: {
            type: DataTypes.ENUM('Admin', 'Member'),
            allowNull: false
        }
    });
    User.associate = function (models) {
        User.hasMany(models.Adoption, { foreignKey: 'UserId' });
    };

    return User;
};