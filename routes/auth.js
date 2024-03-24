var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var db = require("../models");

// Setting up the passport LocalStrategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        db.User.findOne({ where: { Username: username } })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.Password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
            .catch(err => done(err));
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.User.findByPk(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

var router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.get('/signup', function (req, res, next) {
    res.render('signup');
});

router.post('/signup', function (req, res, next) {
    db.User.create({
        FullName: `${req.body.firstname} ${req.body.lastname}`,
        Username: req.body.username,
        Password: req.body.password,
        Role: 'Member' // Default role is member
    })
    .then(() => res.redirect('/login'))
    .catch(err => {
        console.error("Signup error:", err);
        res.redirect('/signup');
    });
});

module.exports = router;
