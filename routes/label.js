var url = require('url');
var query = require('querystring');
var testitems = require('../public/json/items.json');
var testgroups = require('../public/json/groups.json');

var pid;

var label = function (router, model) {
    router.get('/label', function (req, res) {
        if (!req.session.user) {
            req.session.error = "请先登录";
            res.redirect('/login');
        }
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        pid = parseInt(object.pid);
        var path = object.path;

        //渲染到前端的数据，用数组的形式，里面存的是对象
        var items_datas = new Array();
        var groups_datas = new Array();
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
                    item_name: p.item_name,
                    ID: p.ID,
                    type: p.type,
                    group: p.group_name,
                    attributes: new Array()
                }
                for (let q of items_attributes_views) {
                    var exist = false;
                    for (let w of items_data.attributes) {
                        if (w.attr_name == q.attrName) {
                            exist = true;
                            w.attr_values.push(q.attrValue);
                            break;
                        }
                    }
                    if (!exist) {
                        var attribute_obj = {
                            attr_name: q.attrName,
                            attr_values: new Array()
                        }
                        items_data.attributes.push(attribute_obj);
                    }

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
                    group_id: p.cata_id,
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
                        type_id: q.cata_id,
                        attributes: new Array()
                    }
                    for (let w of attributes_views) {
                        //扩展性较低，可采用额外加一个查询，即自底向上的递归查询，获得该子种类的所有父种类
                        if (w.cata_id === q.parent_id || w.cata_id === q.cata_id || w.parent_id == null) {
                            //先到attributes里面找，若找得到
                            var exist = false;
                            for (let e of type_obj.attributes) {
                                if (e.attr_name == w.attrName) {
                                    exist = true;
                                    e.attr_values.push(w.attrValue);
                                    e.attrv_ids.push(w.attrv_id);
                                    break;
                                }
                            }
                            if (!exist) {
                                var attribute_obj = {
                                    attr_name: w.attrName,
                                    attrn_id: w.attrn_id,
                                    attr_values: new Array(),
                                    attrv_ids: new Array(),
                                    multi: w.multi,
                                }
                                type_obj.attributes.push(attribute_obj);
                            }
                        }
                    }
                    group_obj.types.push(type_obj);
                }
                groups_datas.push(group_obj);
            }
            console.log(groups_datas[0].types);
            res.render("label", {
                title: "Label Page",
                path: path,
                items: items_datas,
                groups: groups_datas
            });
        })();
    });
    router.post('/label', function (req, res) {
        var item = model.items;
        var attrtable = model.attrTable;
        var attrvalue = model.attrValue;
        var year = new Date();
        year = (year.getFullYear()).toString().substr(-2);
        for (let p of req.body) {
            //生成ID：例如某一款连衣裙的ID为1723001，是指17年第2季度连衣裙（种类编号为3）的001款）
            //我这里与原需求不同，第二季度改成了pic_id，001款被去掉了
            var handled_ID = year + pid + p.type_id;
            item.create({
                ID: handled_ID,
                item_name: p.item_name,
                cata_id: p.type_id,
                pic_id: pid,
                createTime: Date.now()
            }).then(function (z) {
                console.log('created.' + JSON.stringify(z));
                for (let q of p.attributes) {
                    var attrn_id = q.attrn_id;
                    for (let w of q.attrv_ids) {
                        attrtable.create({
                            ID: handled_ID,
                            attrn_id: attrn_id,
                            attrv_id: w
                        }).then(function (p) {
                            console.log('created.' + JSON.stringify(p));
                        }).catch(function (err) {
                            console.log('failed: ' + err);
                        });
                    }
                }
            }).catch(function (err) {
                console.log('failed: ' + err);
            });
        }
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