var project = function (router, model) {
    router.route("/home/project")
        .get(function (req, res) {
            if (!req.session.user) {
                req.session.error = "请先登录";
                res.redirect('/login');
            }
            var undo_pictures = ["2.png", "3.png"];
            var done_pictures = ["1.png"];
            res.render('pictures', {
                title: 'Express',
                undo_pictures: undo_pictures,
                done_pictures: done_pictures
            });
            // var project = model.project;
            // var projects = null;
            // (async () => {
            //     projects = await project.findAll({});
            //     console.log(`find ${projects.length} project:`);
            //     for (let p of projects) {
            //         console.log(JSON.stringify(p));
            //     }
            // })();
            // res.render("project", {
            //     title: "Project",
            //     //list: JSON.stringify(projects)
            // });
        })
        .post(function (req, res) {
        });
    router.param('pic_id', function (req, res, next, pic_id) {
        // 对name进行验证或其他处理……
        console.log(pic_id);
        req.pic_id = pic_id;
        next();
    });
    router.get('/home/project/:pic_id', function (req, res) {
        //res.send('hello ' + req.name + '!');
        var items = [
            ["棉", "米黄色", "褐色", "奢华", "圆领"],
            ["皮革", "紫色", "黑色", "运动", "低腰"],
            ["涤纶", "黄色", "青色", "简约", "无图案"]
        ]
        res.render("label", {
            title: "Label Page",
            picture: req.pic_id,
            items: items
        });
    });
    router.route("/home/project/pictures")
        .get(function (req, res) {
            if (!req.session.user) {
                req.session.error = "请先登录";
                res.redirect('/login');
            }
            var picture = model.pictures;
            var undo_pictures = null;
            var done_pictures = null;
            (async () => {
                undo_pictures = await picture.findAll({
                    where: {
                        pro_id: req.query.pro_id,
                        pic_status: 'undo'
                    }
                });
            })();
            (async () => {
                done_pictures = await picture.findAll({
                    where: {
                        pro_id: req.query.pro_id,
                        pic_status: 'done'
                    }
                });
            })();
            res.render("pictures", {
                title: "Picture Manage",
                //undo_pictures: JSON.stringify(undo_pictures),
                //done_pictures: JSON.stringify(done_pictures)
            });
        })
        .post(function (req, res) {
        });
    router.route("/home/project/pictures/label")
        .get(function (req, res) {
            if (!req.session.user) {
                req.session.error = "请先登录";
                res.redirect('/login');
            }
            var item = model.item;
            var finished_items = null;
            (async () => {
                finished_items = await item.findAll({
                    where: {
                        pic_id: req.query.pic_id,
                    }
                });
            })();
            res.render("label", {
                title: "Label Page",
                finished_items: JSON.stringify(finished_items),
            });
        })
        .post(function (req, res) {
            var item = model.item;
            var new_items = req.body.new_items;
            for (var i = 0; i < new_items.length; i++) {
                (async () => {
                    var new_item = await item.create({
                        cata_id: new_items[i].cata_id,
                        pic_id: new_items[i].pic_id,
                        createTime: Date.now()
                    });
                })();
            }
            res.redirect('/home/project/pictures/label');
        });
};

module.exports = project;