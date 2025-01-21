var getConnect=require('./db/connect'); //导入数据库连接模块
getConnect();
var createError = require('http-errors'); //用于生成 HTTP 错误响应的中间件
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //用于解析请求中的 Cookie 的中间件
var logger = require('morgan'); //HTTP 请求日志记录器，用于在控制台记录请求信息
//路由導入
var indexRouter = require('./routes/index');
var boardRouter = require('./routes/board/index');
var boardAdminRouter = require('./routes/board/admin/board')
var session=require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev')); //使用 Morgan 记录开发环境的请求日志
app.use(express.json()); //解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true })); //解析 URL 编码的请求体
app.use(cookieParser()); //解析 Cookie 并将其添加到 req.cookies 中
app.use(express.static(path.join(__dirname, 'public'))); //提供静态文件服务，允许访问 public 目录中的静态资源
app.use(session(
  {
    secret: 'recommand 128 bytes random string',
    cookie:{maxAge:20*60*1000},
    resave:false,
    saveUninitialized:false
  }));
//路由設置
app.use('/', indexRouter);
app.use('/board/', boardRouter);
app.use('/board/admin/',boardAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
  next(createError(404));
}); //如果找不到请求的路由，会创建一个 404 错误并传递给下一个中间件

// error handler
app.use(function(err, req, res, next)
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); //捕获所有错误，设置响应状态码，并渲染错误页面。根据环境不同，可能显示不同的错误信息

module.exports = app;
