var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var messages = require('./routes/messages')
var slack = require('./routes/slack')
var signup = require('./routes/signup')
var contexts = require('./routes/contexts')
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/svg', express.static(path.join(__dirname, 'public/vectors')));
app.use('/', express.static(path.join(__dirname, 'public/textflow.us')));

//app.use('/', index);
app.use('/users',users);
app.use('/messages', messages);
app.use('/slack', slack);
app.use('/signup', signup);
app.use('/contexts', contexts);

module.exports = app;
