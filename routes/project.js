var url = require('url');
var query = require('querystring');

var project = function (router, model) {
    router.get("/project", function (req, res) {
        if (!req.session.user) {
            req.session.error = "请先登录";
            res.redirect('/login');
        }
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        var id = parseInt(object.id);

        var Pictures = model.pictures;
        Pictures.findAll({where:{
            pro_id : id,
            pic_status: 'undo'
        }})
        .then(undo=>{
            Pictures.findAll({where:{
                pro_id : id,
                pic_status: 'done'
            }})
            .then(done=>{
                res.render('pictures', {
                    title: 'Express',
                    undo_pictures: undo,
                    done_pictures: done
                });
            })
        })
    });
   
};

module.exports = project;