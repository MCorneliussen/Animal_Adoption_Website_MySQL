const { Temperament, Animal } = require('../models');

class TemperamentService {
    constructor() {
        this.db = { Temperament, Animal };
    }
    async getAllTemperaments() {
        return await Temperament.findAll();
    }

    async addTemperament(name) {
        return await Temperament.create({ Name: name });
    }

    async updateTemperament(id, name) {
        const temperament = await Temperament.findByPk(id);
        if (!temperament) throw new Error('Temperament not found');
        return await temperament.update({ Name: name });
    }

    async deleteTemperamentIfNoAssociatedAnimals(id) {
        const associatedAnimals = await Animal.count({
            include: [{
                model: Temperament,
                as: 'Temperaments',
                where: { id: id }
            }]
        });
        if (associatedAnimals > 0) {
            throw new Error('Temperament cannot be deleted because it is associated with one or more animals');
        }
        await Temperament.destroy({ where: { id } });
    }
}

module.exports = new TemperamentService();