module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        fullName: DataTypes.STRING,
        Username: DataTypes.STRING,
        Password: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM('Admin', 'Member'),
            allowNull: false
        }
    });
    User.associate = function(models) {
        User.hasMany(models.Adoption, { foreignKey: 'UserId' });
    };

    return User;
};