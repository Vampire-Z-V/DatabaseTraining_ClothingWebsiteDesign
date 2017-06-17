var register = function(router, model) {
    router.route('/register')
        .get(function(req, res) {
            res.redirect('/index');
        })
        .post(function(req, res) {
            var user = model.user;
            var uname = req.body.uname;
            var upwd = req.body.upwd;
            var utype = req.body.utype;
            console.log(req.body);

            user.findOne({where: {name: uname}})
                .then(project=> {
                    if(project) {
                        req.session.error = "用户已存在";
                        res.send(500);
                        console.log(req.session.error);
                    } else {
                        user.create({
                            ID:0, 
                            name: uname,
                            user_type:utype,
                            password: upwd
                        }).then(project=> {
                                req.session.error = "用户创建成功";
                                res.send(200);
                                console.log(req.session.error);
                            })
                            .catch(error=> {
                                res.send(500);
                                console.log(error);
                            });
                    }
                })
                .catch(error=> {
                    //为什么这里要先调用res.send()？
                    res.send(500);
                    req.session.error = "网络异常";
                    console.log(error);
                });
            
        });
    };

module.exports = register;