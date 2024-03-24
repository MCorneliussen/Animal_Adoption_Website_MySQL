var express = require('express');
var router = express.Router();
const AnimalService = require('../services/AnimalService.js');
const { isAuthenticated, isAdmin } = require('./authMiddleware');
var db = require("../models");

router.get('/test-auth', isAuthenticated, (req, res) => {
  res.send('You are authenticated and can see this message.');
}); //TODO DELETE 

// Display all animals
router.get('/', async function (req, res, next) {
  const animals = await AnimalService.getAll();
  res.render('animals', { user: req.user, animals: animals });
});

// Serve all animals as JSON
router.get('/api/animals', async function (req, res, next) {
  try {
    const animals = await AnimalService.getAll();
    res.json(animals); // Send back just the data as JSON
  } catch (error) {
    console.error('Failed to fetch animals:', error);
    res.status(500).json({ message: 'Error fetching animals' });
  }
});

// All Animals
router.get('/all', async (req, res) => {
  try {
    const animals = await db.Animal.findAll({
      include: [
        { model: db.Species },
        { model: db.Size },
        { model: db.Temperament, as: 'Temperaments', through: { attributes: [] } },
        { model: db.Adoption, as: 'adoptionDetails' }
      ],
    });
    //console.log(JSON.stringify(animals, null, 2));
    res.json(animals);
  } catch (error) {
    console.error('Error fetching all animals with details:', error);
    res.status(500).json({ message: 'Failed to fetch animals' });
  }
});



// Popular Animal Names
router.get('/popular', async (req, res) => {
  try {
    const popularAnimals = await db.Animal.findAll({
      attributes: [
        'Name',
        [db.sequelize.fn('COUNT', db.sequelize.col('Name')), 'count']
      ],
      group: ['Name'],
      order: [[db.sequelize.fn('COUNT', db.sequelize.col('Name')), 'DESC']]
    });
    res.json(popularAnimals);
  } catch (error) {
    console.error('Error fetching popular animals:', error);
    res.status(500).send(error.message);
  }
});


// All Adoption Details
router.get('/adopted', async (req, res) => {
  try {
    const animals = await db.Animal.findAll({
      where: { Adopted: true }, // Assuming there's an 'Adopted' field to filter by
      include: [
        { model: db.Species },
        { model: db.Size },
        { model: db.Temperament, as: 'Temperaments', through: { attributes: [] } },
        { model: db.Adoption, as: 'adoptionDetails' }
      ]
    });
    res.json(animals);
  } catch (error) {
    console.error('Error fetching adopted animals:', error);
    res.status(500).send(error.message);
  }
});

// Animals By Age
router.get('/by-age', async (req, res) => {
  try {
    const direction = req.query.direction || 'DESC'; // Default to showing oldest first
    const animals = await db.Animal.findAll({
      order: [[db.sequelize.fn('DATEDIFF', db.sequelize.fn('NOW'), db.sequelize.col('Birthday')), direction]],
      include: [
        { model: db.Species },
        { model: db.Size },
        { model: db.Temperament, as: 'Temperaments', through: { attributes: [] } },
        { model: db.Adoption, as: 'adoptionDetails' }
      ]
    });
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals by age:', error);
    res.status(500).json({ message: 'Failed to fetch animals' });
  }
});



// Animals Born In Date Range
router.get('/date-range', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const animals = await db.Animal.findAll({
      where: {
        Birthday: { [db.Sequelize.Op.between]: [startDate, endDate] }
      },
      include: [
        { model: db.Species },
        { model: db.Size },
        { model: db.Temperament, as: 'Temperaments', through: { attributes: [] } },
        { model: db.Adoption, as: 'adoptionDetails' }
      ]
    });
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals by date range:', error);
    res.status(500).json({ message: 'Failed to fetch animals' });
  }
});


// Number of Animals Per Size
router.get('/per-size', async (req, res) => {
  try {
    const sizes = await db.Animal.findAll({
      attributes: ['SizeId', [db.sequelize.fn('COUNT', db.sequelize.col('SizeId')), 'count']],
      include: [{ model: db.Size, attributes: ['Name'] }],
      group: ['SizeId'],
    });
    res.json(sizes);
  } catch (error) {
    console.error('Error fetching number of animals per size:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});



// Endpoint to adopt
router.post('/adopt/:animalId', isAuthenticated, async (req, res) => {
  try {
    await AnimalService.adoptAnimal(req.user.id, req.params.animalId);
    res.json({ message: 'Animal adopted successfully.' });
  } catch (error) {
    console.error('Error adopting animal:', error);
    res.status(500).json({ message: 'Error adopting' });
  }
});

// Endpoint to cancel adoptions
router.post('/cancelAdoption/:animalId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await AnimalService.cancelAdoption(req.params.animalId);
    res.json({ message: 'Adoption calcelled successfully.' });
  } catch (error) {
    console.error('Error cancelling adoption:', error);
    res.status(500).json({ message: 'Error cancelling adopt' });
  }
});

module.exports = router;
