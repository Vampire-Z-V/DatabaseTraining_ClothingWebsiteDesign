var home = function (router, model) {
	var project = model.project;
	router.route("/home")
		.get(function (req, res) {
			if (!req.session.user) {
                req.session.error = "请先登录";
                res.redirect('/login');
            }

            project.findAll()
            	.then(data=>{
            		res.render("home", { projects: data});
            	})
            	.catch(err=>{
            		console.log(err);
            	})

			
		});
};

module.exports = home;