var url = require('url');
var query = require('querystring');
var testitems = require('../public/json/items.json');
var testgroups = require('../public/json/groups.json');

var pid;

var label = function (router, model) {
    router.get('/label', function (req, res) {
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        pid = parseInt(object.pid);
        var path = object.path;

        //渲染到前端的数据，用数组的形式，里面存的是对象
        var items_datas = new Array();
        var groups_datas = new Array();
        var catagory = model.catagory;
        var attrname = model.attrname;
        var attrvalue = model.attrvalue;
        (async () => {
            var items_catagory_views = await model.items_catagory_view.findAll({
                where: {
                    pic_id: pid
                }
            });
            for (let p of items_catagory_views) {
                var items_attributes_views = await model.items_attributes_view.findAll({
                    where: {
                        ID: p.ID
                    }
                });
                var items_data = {
                    ID: p.ID,
                    type: p.type,
                    group_name: p.group_name,
                    attributes: new Array()
                }
                for (let q of items_attributes_views) {
                    var attribute = {
                        attr_name: q.attrName,
                        attr_values: q.attrValue
                    }
                    items_data.attributes.push(attribute);
                }
                items_datas.push(items_data);
            }
            //groups_data
            var attributes_views = await model.attributes_view.findAll({});
            var catagories = await model.catagory.findAll({
                where: {
                    parent_id: 1 //比较低的可扩展性
                }
            });
            for (let p of catagories) {
                var group_obj = {
                    group: p.cata_name,
                    types: new Array()
                }
                var sub_catagories = await model.catagory.findAll({
                    where: {
                        parent_id: p.cata_id
                    }
                });
                for (let q of sub_catagories) {
                    var type_obj = {
                        type: q.cata_name,
                        attributes: new Array()
                    }
                    for (let w of attributes_views) {
                        if (w.cata_id === q.cata_id || w.parent_id == null ) {
                            type_obj.attributes.push(w);
                        }
                    }
                    group_obj.types.push(type_obj);
                }
                groups_datas.push(group_obj);
            }
            //
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
            for (let p of groups_datas)
                console.log(p.types);
            res.render("label", {
                title: "Label Page",
                path: path,
                //items: testitems,
                items: items_datas,
                //group: group,
                //subgroup: subgroup,
                attrn_group: attrn_group,
                attrvalue_group: attrvalue_group,
                //groups: testgroups
                groups: groups_datas
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
            //console.log(req.body);
            res.render('ejs/label.ejs', req.body);
        });
    router.route("/attributepage")
        .post(function (req, res) {
            //console.log(req.body);
            res.render('ejs/attributes.ejs', req.body);
        });
}


module.exports = label;