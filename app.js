const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const {
  checkToken
} = require('./routes/middlewares/token.middleware');
const usersRouter = require('./routes/users');
const festivalesRouter = require('./routes/festivales');
const checkTokenRouter = require('./routes/checkToken');


require('dotenv').config();

var app = express();
require('./db').connect();

// view engine setup
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.url === '/') {
    res.redirect('/home');
  } else {
    next();
  }
})

app.use('/users', usersRouter);
app.use('/users/login', checkToken, usersRouter);
app.use('/fests', checkToken, festivalesRouter);
app.use('/checkToken', checkToken, checkTokenRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;