var url = require('url');
var query = require('querystring');
var id;
var completedProject = function (router, model) {
    router.get("/completedProject", function (req, res) {
        if (!req.session.user) {
            res.status(401).render('ejs/messege.ejs', { msg: "Please login first.", status: 401 }, function (error, string) {
                req.session.msg = string;
                res.redirect('/index');
            });
        }
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        id = parseInt(object.id);

        var Pictures = model.pictures;
        Pictures.findAll({
            where: {
                pro_id: id,
                pic_status: 'useless'
            }
        })
            .then(useless => {
                Pictures.findAll({
                    where: {
                        pro_id: id,
                        pic_status: 'done'
                    }
                })
                    .then(done => {
                        res.render('completedProject', {
                            id: id,
                            undo_pictures: useless,
                            done_pictures: done,
                            pro_id: id
                        });
                    })
            })
    });
};

module.exports = completedProject;