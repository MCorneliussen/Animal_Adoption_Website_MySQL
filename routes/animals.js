var express = require('express');
var router = express.Router();
const AnimalService = require('../services/AnimalService');
const { isAuthenticated, isAdmin } = require('./authMiddleware');

router.get('/', async function (req, res, next) {
  try {
    const animals = await AnimalService.getAll();
    res.render('animals', { user: req.user, animals: animals });
  } catch (error) {
    console.error('Error displaying all animals:', error);
    res.status(500).send('Failed to display all animals');
  }
});

router.get('/all', function(req, res) {
  res.redirect('/animals');
});

router.get('/popular', async (req, res) => {
  try {
    const animals = await AnimalService.getPopularAnimals();
    res.json(animals);
  } catch (error) {
    console.error('Error fetching popular animals:', error);
    res.status(500).send('Failed to fetch popular animals');
  }
});

router.get('/adopted', async (req, res) => {
  try {
    const animals = await AnimalService.getAdoptedAnimals();
    res.json(animals);
  } catch (error) {
    console.error('Error fetching adopted animals:', error);
    res.status(500).send('Failed to fetch adopted animals');
  }
});

router.get('/by-age', async (req, res) => {
  const direction = req.query.direction || 'DESC';
  try {
    const animals = await AnimalService.getAnimalsByAge(direction);
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals by age:', error);
    res.status(500).send('Failed to fetch animals by age');
  }
});

router.get('/date-range', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const animals = await AnimalService.getAnimalsByDateRange(startDate, endDate);
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals by date range:', error);
    res.status(500).send('Failed to fetch animals by date range');
  }
});

router.get('/per-size', async (req, res) => {
  try {
    const animals = await AnimalService.getAnimalsBySize();
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals per size:', error);
    res.status(500).send('Failed to fetch animals per size');
  }
});

router.post('/adopt/:animalId', isAuthenticated, async (req, res) => {
  try {
    await AnimalService.adoptAnimal(req.user.id, req.params.animalId);
    res.json({ message: 'Animal adopted successfully.' });
  } catch (error) {
    console.error('Error adopting animal:', error);
    res.status(500).json({ message: 'Error adopting' });
  }
});

router.post('/cancelAdoption/:animalId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await AnimalService.cancelAdoption(req.params.animalId);
    res.json({ message: 'Adoption cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling adoption:', error);
    res.status(500).json({ message: 'Error cancelling adoption' });
  }
});

module.exports = router;
