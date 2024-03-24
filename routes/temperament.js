var express = require('express');
var router = express.Router();
const TemperamentService = require('../services/TemperamentService');
const { isAdmin } = require('./authMiddleware');

router.get('/', isAdmin, async function (req, res) {
    const temperaments = await TemperamentService.getAllTemperaments();
    res.render("temperament", { temperaments, user: req.user });
});

router.post('/add', isAdmin, async (req, res) => {
    await TemperamentService.addTemperament(req.body.Name);
    res.redirect('/temperament');
});

router.post('/update/:id', isAdmin, async function (req, res) {
    try {
        await TemperamentService.updateTemperament(req.params.id, req.body.Name);
        res.json({ success: true, message: 'Temmperament updated successfully' });
    } catch (error) {
        console.error('Error updating temperament', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/delete/:id', isAdmin, async (req, res) => {
    try {
        await TemperamentService.deleteTemperamentIfNoAssociatedAnimals(req.params.id);
        res.json({ success: true, message: 'Temmperament deleted successfully' });
    } catch (error) {
        console.error('Error deleting temperament:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;