var complete = function (router, model) {
	var project = model.project;
	router.route("/complete")
		.get(function (req, res) {
			if (!req.session.user) {
				res.status(401).render('ejs/messege.ejs', { msg: "Please login first.", status: 401 }, function (error, string) {
					req.session.msg = string;
					res.redirect('/index');
				});
			}

			project.findAll({ where: { pro_status: 'done' } })
				.then(data => {
					res.render("complete", { projects: data });
				})
				.catch(err => {
					console.log(err);
				})

		});
};

module.exports = complete;