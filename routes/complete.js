var complete = function (router, model) {
	var project = model.project;
	router.route("/complete")
		.get(function (req, res) {
			if (!req.session.user) {
                req.session.error = "请先登录";
                res.redirect('/index');
            }

            project.findAll({where:{pro_status : 'done'}})
            	.then(data=>{
            		res.render("complete", { projects: data});
            	})
            	.catch(err=>{
            		console.log(err);
            	})

			
		});
};

module.exports = complete;