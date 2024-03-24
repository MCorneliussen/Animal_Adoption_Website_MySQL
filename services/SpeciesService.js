const { Species, Animal } = require('../models');

class SpeciesService {
    constructor() {
        this.db = { Species, Animal};
    }
    async addSpecies(name) {
        return Species.create({ Name: name });
    }

    async getAllSpecies() {
        return Species.findAll();
    }

    async updateSpecies(id, name) {
        return Species.update({ Name: name }, { where: { id } });
    }

    async deleteSpecies(id) {
        return Species.destroy({ where: { id } });
    }

    async deleteSpeciesIfNoAssociatedAnimals(speciesId){
        const associatedAnimals = await this.db.Animal.count({ where: { SpeciesId: speciesId } });
        if (associatedAnimals > 0) {
            throw new Error('Species cannot be deleted because it is associated with one or more animals');
        }
        return this.deleteSpecies(speciesId);
    }
}

module.exports = new SpeciesService();