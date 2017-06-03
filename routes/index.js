var express = require('express');
var router = express.Router();
var model = require('../model/model');

var login = require('./login');
var register = require('./register');
var project = require('./project');

/* GET home page. */
//test
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

//登录路由
login(router, model);

//注册路由
register(router, model);

router.get('/home', function (req, res) {
	if (!req.session.user) {
		req.session.error = "请先登录";
		res.redirect('/login');
	}
	res.render("home", { title: "Home" });
});

router.get('/logout', function (req, res) {
	req.session.user = null;
	req.session.error = null;
	res.redirect('/');
});

//系统管理员
project(router, model);

module.exports = router;
