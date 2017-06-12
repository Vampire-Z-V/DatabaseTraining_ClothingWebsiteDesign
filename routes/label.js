var url = require('url');
var query = require('querystring');
var testitems = require('../public/json/items.json');
var testgroups = require('../public/json/groups.json');

var pid;

var label = function(router, model) {
    router.get('/label', function (req, res) {
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        pid = parseInt(object.pid);
        var path = object.path;


        var datas = new Array();
        var item_labels = model.item_labels;
        var catagory = model.catagory;
        var attrname = model.attrname;
        var attrvalue = model.attrvalue;
        (async () => {
            var finished_items = await item_labels.findAll({
                where: {
                    pic_id: pid
                }
            });
            var data = {//要传输的数据小块
                ID: null,
                values: new Array()
            }
            for (let p of finished_items) {
                if (data.ID === null) {
                    data.ID = p.ID;
                    data.values.push(p.attrValue);
                }
                else if (data.ID === p.ID)
                    data.values.push(p.attrValue);
                else {
                    datas.push(data);
                    data = new Object();
                    data.ID = p.ID;
                    data.values = [];
                    data.values.push(p.attrValue);
                }
            }
            datas.push(data);
            console.log(JSON.stringify(datas));
            console.log(JSON.stringify(testitems));
            var catagories = await catagory.findAll({});
            var group = new Array();
            var subgroup = new Array();
            for (let p of catagories) {
                //console.log(JSON.stringify(p));
                if (p.parent_id === 1)
                    group.push(p);
                else if (p.parent_id != null)
                    subgroup.push(p);
            }
            var attrnames = await attrname.findAll({});
            var attrn_group = new Array();
            for (let p of attrnames) {
                attrn_group.push(p);
            }
            var attrvalues = await attrvalue.findAll({});
            var attrvalue_group = new Array();
            for (let p of attrvalues) {
                //console.log(JSON.stringify(p));
                attrvalue_group.push(p);
            }
            res.render("label", {
                title: "Label Page",
                path: path,
                items: testitems,
                group: group,
                subgroup: subgroup,
                attrn_group: attrn_group,
                attrvalue_group: attrvalue_group,
                groups: testgroups
            });
        })();
    });
    router.post('/label', function (req, res) {
        var item = model.item;
        var attrtable = model.attrTable;
        var attrvalue = model.attrValue;
        item.create({
            ID: "005",
            cata_id: req.body.cata_id,
            pic_id: pid,
            createTime: Date.now()
        }).then(function (p) {
            console.log('created.' + JSON.stringify(p));
        }).catch(function (err) {
            console.log('failed: ' + err);
        });
        attrvalue.findAll({
        }).then(function (p) {
            for (let a of p) {
                //console.log(typeof(a.attrv_id));
                for (let b of req.body.attribute) {
                    // === 是值和类型都相同 == 的话条件松一些
                    if (b == a.attrv_id) {
                        attrtable.create({
                            ID: "005",
                            attrn_id: a.attrn_id,
                            attrv_id: b
                        }).then(function (q) {
                            console.log('created.' + JSON.stringify(q));
                        }).catch(function (err) {
                            console.log('failed: ' + err);
                        });
                    }
                }
            }
        }).catch(function (err) {
            console.log('failed: ' + err);
        });
    });

    router.route("/newlabel")
        .post(function (req, res) {
            console.log(req.body);
            res.render('ejs/label.ejs', req.body);
        });
    router.route("/attributepage")
        .post(function (req, res) {
            console.log(req.body);
            res.render('ejs/attributes.ejs', req.body);
        });
}


module.exports = label;