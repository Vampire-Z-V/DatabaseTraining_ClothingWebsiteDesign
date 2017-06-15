var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var formidable = require('express-formidable');
var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);

var config = require('./model/config');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

app.use(session({
	key: config.database,
	secret: config.cookieSecret,
	cookie:{
		maxAge: 1000*60*30*2*24
	},
	//store: new MySQLStore(config),
    resave: true,
    saveUninitialized: true
}));
app.use(function (req, res, next) {
	//这些步骤的目的是？？？
	res.locals.user = req.session.user;
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = "";
	if(err) {
		res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'
			+err+'</div>';
	}
	next();
});


//设置视图文件的存放路径
app.set('views', path.join(__dirname, 'views'));
//封装ejs引擎，注册html引擎
//之所以要这么做是为了创建模板文件时，可以使用代码补全功能
app.engine("html",require("ejs").renderFile);
//设置视图引擎
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//加上这一段代码会出现：Error: Can't set headers after they are sent.
// app.use(formidable({
//   encoding: 'utf-8',
//   //设置文件上传的路径
//   uploadDir: __dirname + '/public/image',
//   multiples: true, // req.files to be arrays of files,
//   //默认不保存文件名，因此这里需要保存文件名
//   keepExtensions: true
// }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/index', routes);
app.use('/users', users);
//创建路由
app.use('/login', routes);
app.use('/register', routes);
app.use('/home', routes);

app.use('/complete', routes);

app.use('/label', routes);
app.use('/logout', routes);
app.use('/upload', routes);



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

module.exports = app;
