var express = require('express');
var router = express.Router();
const AnimalService = require('../services/AnimalService.js');
const { isAuthenticated, isAdmin } = require('./authMiddleware');

router.get('/test-auth', isAuthenticated, (req, res) => {
  res.send('You are authenticated and can see this message.');
}); //TODO DELETE 

// Display all animals
router.get('/', async function (req, res, next) {
  const animals = await AnimalService.getAll();
  res.render('animals', { user: req.user, animals: animals });
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
