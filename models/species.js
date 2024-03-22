module.exports = (sequelize, DataTypes) => {
    const Species = sequelize.define('Species', {
        Name: DataTypes.STRING
    });

    Species.associate = function(models) {
        Species.hasMany(models.Animal, { foreignKey: 'SpeciesId' });
    };

    return Species;
};