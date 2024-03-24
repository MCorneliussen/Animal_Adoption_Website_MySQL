var express = require('express');
var router = express.Router();
const { populateDatabaseInOrder } = require('../services/populateDatabase');

router.post('/populate-database', async (req, res) => {
  try {
    await populateDatabaseInOrder();
    //res.json({ message: 'Database populated successfully!' });
  } catch (error) {
    console.error('Database population failed', error);
    res.status(500).json({ message: 'Error populating the database' });
  }
});

router.get('/', (req, res) => {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Express', user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Express', user: req.user });
});

module.exports = router;
