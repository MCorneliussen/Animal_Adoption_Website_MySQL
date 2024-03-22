module.exports = (sequelize, DataTypes) => {
    const Adoption = sequelize.define('Adoption', {
        AdoptionDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    Adoption.associate = function (models) {
        Adoption.belongsTo(models.User, { foreignKey: 'UserId' });
        Adoption.belongsTo(models.Animal, { foreignKey: 'AnimalId', as: 'adoptedAnimal' });
    };

    return Adoption;
};