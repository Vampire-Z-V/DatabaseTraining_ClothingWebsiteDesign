var register = function (router, model) {
    router.route('/register')
        .get(function (req, res) {
            res.redirect('/index');
        })
        .post(function (req, res) {
            var user = model.user;
            var uname = req.body.uname;
            var upwd = req.body.upwd;
            var utype = req.body.utype;
            console.log(req.body);

            user.findOne({ where: { name: uname } })
                .then(project => {
                    if (project) {
                        res.status(409).render('ejs/messege.ejs', { msg: "User already exists.", status: 409 });
                    } else {
                        user.create({
                            ID: 0,
                            name: uname,
                            user_type: utype,
                            password: upwd
                        }).then(project => {
                            res.status(200).render('ejs/messege.ejs', { msg: "User created successfully.", status: 200 }, function (error, string) {
                                req.session.msg = string;
                                res.end();
                            });
                        })
                            .catch(error => {
                                res.send(500);
                                console.log(error);
                            });
                    }
                })
                .catch(error => {
                    res.status(500).render('ejs/messege.ejs', { msg: "Network anomaly.", status: 500 });
                });

        });
};

module.exports = register;