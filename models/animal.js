module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define('Animal', {
        Name: DataTypes.STRING,
        Birthday: DataTypes.DATE,
        Adopted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Animal.associate = function(models) {
        Animal.belongsTo(models.Species, { foreignKey: 'SpeciesId' });
        Animal.belongsTo(models.Size, { foreignKey: 'SizeId' });
        Animal.belongsToMany(models.Temperament, { through: 'AnimalTemperaments', foreignKey: 'AnimalId', as: 'Temperaments'});
        Animal.hasOne(models.Adoption, { as: 'adoptionDetails', foreignKey: 'AnimalId' });
    };

    return Animal;
};