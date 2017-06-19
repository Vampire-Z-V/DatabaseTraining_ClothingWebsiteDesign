var express = require('express');
var router = express.Router();
var model = require('../model/model');

var login = require('./login');
var register = require('./register');
var project = require('./project');
var upload = require('./upload');
var home = require('./home');
var designer = require('./designer');
var stocks = require('./stocks');

var complete = require('./complete');

var label = require('./label');

/* GET home page. */
//test
router.get('/', function(req,res){
	res.redirect('/index');
});

router.get('/index', function (req, res, next) {
	res.render('index', {
		title: 'Welcome'
	});
});

//登录路由
login(router, model);

//注册路由
register(router, model);

home(router, model);

designer(router, model);

stocks(router, model);

complete(router, model);

label(router, model);

router.get('/logout', function (req, res) {
	req.session.user = null;
	req.session.error = null;
	res.redirect('/index');
});

upload(router, model);

//系统管理员
project(router, model);

module.exports = router;
