module.exports = (sequelize, DataTypes) => {
    const Temperament = sequelize.define('Temperament', {
        Name: DataTypes.STRING
    });

    Temperament.associate = function(models) {
        Temperament.belongsToMany(models.Animal, { through: 'AnimalTemperaments', foreignKey: 'TemperamentId'});
    };

    return Temperament;
};