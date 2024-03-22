module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('Size', {
        Name: DataTypes.STRING
    });

    Size.associate = function(models) {
        Size.hasMany(models.Animal, {foreignKey: 'SizeId'});
    };

    return Size;
};