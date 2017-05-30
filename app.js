var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var login = require('./routes/login');
var index = require('./routes/index');
var users = require('./routes/users');

///////////////////////////////////////////
// app
//////////////////////////////////////////
var app = express();

//////////////////////////////////////////
// template engine, conside handlebars
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////////////////
// page routes
//////////////////////////////////////////
app.use('/login', login);

app.use('/', index);

app.get('/logout', function (req, res) {
    delete req.session.user_id;
    res.redirect('/login');
});
//////////////////////////////////////////


//////////////////////////////////////////
// Ajax endpoint
let api = require('./src/server/api/Api');
let snd = require('./routes/ajax/channels/AjaxEndpointSendMessage');
snd(app,api);
//////////////////////////////////////////

//////////////////////////////////////////
// express middleware
//
// Check if the user is authenticated:
// middleware function named CheckAuth which I use on every route
// that needs the user to be authenticated:
//////////////////////////////////////////
function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        var err = new Error('Not logged in, not Autherized');
        err.status = 300; // ??
        next(err);
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
//////////////////////////////////////////

module.exports = app;


