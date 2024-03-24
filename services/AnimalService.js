const { sequelize, Animal, Adoption, Species, Size, Temperament } = require('../models');

class AnimalService {
    constructor() {
        this.db = { Animal, Adoption, Species, Size, Temperament, sequelize };
    }

    async getAll() {

        let animals = await this.db.Animal.findAll({
            include: [
                { model: this.db.Species, as: 'Species', attributes: ['Name'] },
                { model: this.db.Temperament, as: 'Temperaments', attributes: ['Name'], through: { attributes: [] } },
                { model: this.db.Size, as: 'Size', attributes: ['Name'] },
                { model: this.db.Adoption, as: 'adoptionDetails', attributes: ['AdoptionDate'] }
            ]
        })

        animals = animals.map(animal => {
            const formattedBirthday = this.formatDate(animal.Birthday);
            const age = this.calculateAge(animal.Birthday);

            const temperament = animal.Temperaments.map(t => t.Name).join(', ');

            return {
                ...animal.get({ plain: true }),
                Species: animal.Species.Name,
                Size: animal.Size.Name,
                Temperament: temperament,
                FormattedBirthday: formattedBirthday,
                Age: age
            };
        });

        return animals;
    }
    
    formatDate(date) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }

    calculateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    async adoptAnimal(userId, animalId) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const animal = await this.db.Animal.findByPk(animalId, { transaction });
            if (!animal) throw new Error('Animal not found');
            const isAdopted = await this.db.Adoption.findOne({ where: { AnimalId: animalId } }, { transaction });
            if (isAdopted) throw new Error('Animal is Already adopted');
            await this.db.Adoption.create({
                UserId: userId,
                AnimalId: animalId,
                AdoptionDate: new Date(),
            }, { transaction });
            await animal.update({ Adopted: true }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async cancelAdoption(animalId) {
        const transaction = await this.db.sequelize.transaction();
        try {
            await this.db.Adoption.destroy({
                where: { AnimalId: animalId },
                transaction: transaction
            });

            await this.db.Animal.update(
                { Adopted: false },
                { where: { id: animalId }, transaction: transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}

module.exports = new AnimalService();