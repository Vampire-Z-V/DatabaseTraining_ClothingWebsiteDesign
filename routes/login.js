var login = function (router, model) {
	router.route("/login")
		.get(function (req, res) {
			res.redirect('/index');
		})
		.post(function (req, res) {
			var user = model.user;
			//req.body.uname?
			var uname = req.body.uname;

			user.findOne({ where: { name: uname } })
				.then(p => {
					if (p) {
						//req.body.upwd?
						if (req.body.upwd != p.password) {
							req.session.error = "密码错误";
							res.send(404);
						} else {
							req.session.user = p;
							//res.send(200);
							res.send(p.user_type);
						}
					} else {
						req.session.error = "用户不存在";
						res.send(404);
					}
				})
				.catch(error => {
					res.send(500);
					console.log(error);
				});

		});

};

module.exports = login;