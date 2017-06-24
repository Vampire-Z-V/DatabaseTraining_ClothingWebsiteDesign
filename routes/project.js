var url = require('url');
var query = require('querystring');

var project = function (router, model) {
    router.get("/project", function (req, res) {
        if (!req.session.user) {
            res.status(401).render('ejs/messege.ejs', { msg: "Please login first.", status: 401 }, function (error, string) {
                req.session.msg = string;
                res.redirect('/index');
            });
        }
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        var id = parseInt(object.id);

        var Pictures = model.pictures;
        Pictures.findAll({
            where: {
                pro_id: id,
                pic_status: 'undo'
            }
        })
            .then(undo => {
                Pictures.findAll({
                    where: {
                        pro_id: id,
                        pic_status: 'done'
                    }
                })
                    .then(done => {
                        res.render('project', {
                            id: id,
                            undo_pictures: undo,
                            done_pictures: done,
                            pro_id: id
                        });
                    })
            })
    });

    router.post('/project', function (req, res) {
        var id = req.body.id;
        var Project = model.project;
        var Pictures = model.pictures;
        Pictures.findAll({ where: { pro_id: id, pic_status: 'undo' } })
            .then(data => {
                if (!data) {
                    Project.update({ pro_status: 'done' }, { where: { pro_id: id } })
                        .then(data => {
                            res.json(['success']);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    res.json(['fail']);
                }
            })
            .catch(err => {
                console.log(err);
            })

    })
};

module.exports = project;