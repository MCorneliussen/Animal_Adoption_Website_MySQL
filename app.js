require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var animalsRouter = require('./routes/animals');
var speciesRouter = require('./routes/species');
var temperamentRouter = require('./routes/temperament');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/animals', animalsRouter);
app.use('/species', speciesRouter);
app.use('/temperament', temperamentRouter);



// Establish db connection, drop tables and sync
const db = require('./models');
db.sequelize.authenticate()
  .then(() => {
    //console.log('Connection successful');
    // sync all models
    return db.sequelize.sync({ force: true }); //TODO SET TO FALSE!
  })
  .then(() => {
    //console.log('& Database synced');
  })
  .catch(err => {
    console.error('Unable to connect to database', err);
  });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('Unhandled route: ', req.method, req.path);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

