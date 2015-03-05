var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var dotenv = require('dotenv').load();
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var path = require('path');
var routes = require('./routes/index');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
// var flash = require('express-flash');
// var mongoose = require('mongoose'); // forgot password feature is stubbed for mongodb
var nodemailer = require('nodemailer');

var app = express();

var WHITELIST = [
  'http://localhost:4000',
  'http://landline.io',
  'https://landline.io',
  'https://landline.herokuapp.com',
  'https://landline-api.herokuapp.com'
];

var corsOptions = {
  methods: ['GET'],
  origin: function(origin, callback) {
    callback(null, WHITELIST.indexOf(origin) > -1);
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(flash());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public', 'scss'),
    dest: path.join(__dirname, 'public'),
    debug: true
  })
);
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "121332132"
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/landline/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/basscss/css')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
