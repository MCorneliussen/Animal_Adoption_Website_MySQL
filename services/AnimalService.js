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
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
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
    async getPopularAnimals() {
        return this.db.Animal.findAll({
            attributes: [
                'Name',
                [this.db.sequelize.fn('COUNT', this.db.sequelize.col('Name')), 'NameCount']
            ],
            group: ['Name'],
            order: [[this.db.sequelize.col('NameCount'), 'DESC']],
            raw: true,
        });
    }

    async getAdoptedAnimals() {
        return this.getAllWithFilter({ Adopted: true });
    }

    async getAnimalsByAge(direction = 'DESC') {
        return this.db.Animal.findAll({
            order: [[this.db.sequelize.literal('DATEDIFF(CURRENT_DATE, Birthday)'), direction]],
            include: this.commonIncludes(),
        });
    }

    async getAnimalsByDateRange(startDate, endDate) {
        return this.db.Animal.findAll({
            where: {
                Birthday: {
                    [this.db.Sequelize.Op.between]: [startDate, endDate],
                },
            },
            include: this.commonIncludes(),
        });
    }

    async getAnimalsBySize() {
        return this.db.Size.findAll({
            include: {
                model: this.db.Animal,
                as: 'Animals',
                attributes: [],
            },
            group: ['Size.id'],
            attributes: ['Name', [this.db.sequelize.fn('COUNT', this.db.sequelize.col('Animals.id')), 'AnimalCount']],
        });
    }

    commonIncludes() {
        return [
            { model: this.db.Species, as: 'Species', attributes: ['Name'] },
            { model: this.db.Temperament, as: 'Temperaments', attributes: ['Name'], through: { attributes: [] } },
            { model: this.db.Size, as: 'Size', attributes: ['Name'] },
            { model: this.db.Adoption, as: 'adoptionDetails', attributes: ['AdoptionDate'] }
        ];
    }

    async getAllWithFilter(filter) {
        return this.db.Animal.findAll({
            where: filter,
            include: this.commonIncludes(),
        });
    }
}



module.exports = new AnimalService();