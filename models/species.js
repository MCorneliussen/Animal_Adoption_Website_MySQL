module.exports = (sequelize, DataTypes) => {
    const Species = sequelize.define('Species', {
        name: DataTypes.STRING
    });

    Species.associate = function(models) {
        Species.hasMany(models.Animal, { foreignKey: 'SpeciesId' });
    };

    return Species;
};