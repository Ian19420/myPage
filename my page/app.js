var getConnect = require('./db/connect');
getConnect();
var createError = require('http-errors'); 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); 
var logger = require('morgan'); 

var indexRouter = require('./routes/index');
var boardRouter = require('./routes/board/index');
var boardAdminRouter = require('./routes/board/admin/board');
var snakeRouter = require('./routes/snake/index');
var jumpRouter = require('./routes/jump/index');
var cloneRouter = require('./routes/breakoutClone/index');
var session=require('express-session');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(session(
  {
    secret: 'recommand 128 bytes random string',
    cookie:{maxAge:20*60*1000},
    resave:false,
    saveUninitialized:false
  }));

app.use('/', indexRouter);
app.use('/board/', boardRouter);
app.use('/board/admin/',boardAdminRouter);
app.use('/snake/',snakeRouter);
app.use('/jump/', jumpRouter);
app.use('/breakoutClone/',cloneRouter);


app.use(function(req, res, next)
{
  next(createError(404));
});


app.use(function(err, req, res, next)
{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000,'0.0.0.0');

module.exports = app;
