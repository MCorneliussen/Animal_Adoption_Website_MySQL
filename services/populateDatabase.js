const fs = require('fs').promises;
const path = require('path');
const { sequelize } = require('../models');

// Function to populate a table from a given JSON file containing SQL queries
async function populateDatabase(fileNames) {
    for (const fileName of fileNames) {
        const filePath = path.join(__dirname, '..', 'public', 'json', fileName);
        const jsonData = await fs.readFile(filePath, 'utf8');
        const queries = JSON.parse(jsonData);

        for (const { query } of queries) {
            await sequelize.query(query);
        }
        console.log(`${fileName} processed and data inserted to db`);
    }

}

async function populateDatabaseInOrder() {
    const fileOrder = [
        'species.json',
        'sizes.json',
        'temperaments.json',
        'users.json',
        'animals.json',
        'adoption.json',
        'animalTemperaments.json'
    ];
    try {
        await populateDatabase(fileOrder);
        console.log('All data successfully populated, finally');
    } catch (error) {
        console.error('Failed to populate database:', error);
    }
}

module.exports = { populateDatabase, populateDatabaseInOrder };