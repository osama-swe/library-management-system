var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expHBS = require('express3-handlebars');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bookRouter = require('./routes/book');
var borrowerRouter = require('./routes/borrower');
var borrowRouter = require('./routes/borrow');
var returnRouter = require('./routes/return');

var app = express();

// Define the lookup helper function
var lookup = function (obj, key) {
  return obj && obj[key];
};

// view engine setup
var hbs = expHBS.create({
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    lookup: lookup
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/book', bookRouter);
app.use('/borrower', borrowerRouter);
app.use('/borrow', borrowRouter);
app.use('/return', returnRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
