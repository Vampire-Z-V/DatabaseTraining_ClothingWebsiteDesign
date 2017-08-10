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
						if (req.body.upwd != p.password) {
							res.status(405).render('ejs/messege.ejs', { msg: "Incorrect password.", status: 405 });
						} else {
							req.session.user = p;
							res.send(p.user_type);
						}
					} else {
						res.status(404).render('ejs/messege.ejs', { msg: "Incorrect user.", status: 404 });
					}
				})
				.catch(error => {
					res.send(500);
					console.log(error);
				});

		});

};

module.exports = login;