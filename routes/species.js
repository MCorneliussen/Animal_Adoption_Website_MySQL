var express = require('express');
var router = express.Router();
const db = require('../models');
const Animal = db.Animal;
const SpeciesService = require('../services/SpeciesService');
const { isAdmin } = require('./authMiddleware');

router.get('/', isAdmin, async function (req, res) {
    const species = await SpeciesService.getAllSpecies();
    res.render('species', { species, user: req.user })
})

router.post('/add', isAdmin, async (req, res) => {
    await SpeciesService.addSpecies(req.body.Name);
    res.redirect('/species');
});

router.post('/update/:id', isAdmin, async (req, res) => {
    try {
        await SpeciesService.updateSpecies(req.params.id, req.body.Name);
        res.json({ message: 'species updated successfulløy' });
    } catch (error) {
        console.error('error updating species:', error);
    }
});

router.post('/delete/:id', isAdmin, async (req, res) => {
    try {
        await SpeciesService.deleteSpeciesIfNoAssociatedAnimals(req.params.id);
        res.json({ success: true, message: 'species eradicated' });
    } catch (error) {
        console.error('Error deleting species:', error);
        res.status(400).send({ success: false, message: error.message });
    }
});

router.post('/update', async function (req, res, next) {
    res.render("index", { user: req.user })
})

module.exports = router;