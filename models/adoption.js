module.exports = (sequelize, DataTypes) => {
    const Adoption = sequelize.define('Adoption', {
        adoptionDate: {
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