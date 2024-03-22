var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    temperament = [
        {
            Id: 1,
            Name: "Calm"
        },
        {
            Id: 2,
            Name: "Scared"
        }
    ]
    res.render("temperament", {user: req.user, temperament: temperament})
})

router.post('/update', async function (req,res,next){
    res.render("index",{user: req.user})
})

module.exports = router;