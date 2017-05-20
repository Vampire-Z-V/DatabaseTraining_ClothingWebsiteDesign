var login = function(router, model) {
	router.route("/login")
		.get(function(req, res) {
			res.render("login", {title: "User login"});
		})
		.post(function(req, res) {
			var user = model.user;
			//req.body.uname?
			var uname = req.body.uname;

			user.findOne({where: {name: uname}})
				.then(project=> {
					if(project) {
						//req.body.upwd?
						if(req.body.upwd != project.password) {
							req.session.error = "密码错误";
							res.send(404);
						} else {
							req.session.user = project;
							res.send(200);
						}
					} else {
						req.session.error = "用户不存在";
						res.send(404);
					}
				})
				.catch(error=> {
					res.send(500);
					console.log(error);
				});
			
		});
};

module.exports = login;