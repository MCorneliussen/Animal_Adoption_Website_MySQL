module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('Size', {
        name: DataTypes.STRING
    });

    Size.associate = function(models) {
        Size.hasMany(models.Animal, {foreignKey: 'SizeId'});
    };

    return Size;
};