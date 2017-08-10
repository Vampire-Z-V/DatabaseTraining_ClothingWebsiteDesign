var home = function (router, model) {
	var project = model.project;
	router.route("/home")
		.get(function (req, res) {
			if (!req.session.user) {
				res.status(401).render('ejs/messege.ejs', { msg: "Please login first.", status: 401 }, function (error, string) {
					req.session.msg = string;
					res.redirect('/index');
				});
			}


			project.findAll({ where: { pro_status: 'undo' } })
				.then(data => {
					res.render("home", { projects: data });
				})
				.catch(err => {
					console.log(err);
				})


		});
};

module.exports = home;