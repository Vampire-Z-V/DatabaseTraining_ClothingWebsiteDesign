var url = require('url');
var query = require('querystring');
var testitems = require('../public/json/items.json');
var testgroups = require('../public/json/groups.json');

var pid;

var label = function (router, model) {
    router.get('/label', function (req, res) {
        if (!req.session.user) {
            req.session.error = "请先登录";
            res.redirect('/index');
        }
        var string = url.parse(req.url).query;
        var object = query.parse(string);
        pid = parseInt(object.pid);
        var path = object.path;
        var pro_id = object.pro_id;
        //渲染到前端的数据，用数组的形式，里面存的是对象
        var items_datas = new Array();
        var groups_datas = new Array();
        (async () => {
            //同一组任务的状态为done的图片及单品数据，用于选择同款
            var sequelize = model.sequelize;
            var done_pictures_items = await model.sequelize.query
                ("select * from pictures natural join pictures_items_relation natural join items natural join catagory WHERE pro_id = ? and pic_status = 'done' ",
                { replacements: [pro_id], type: sequelize.QueryTypes.SELECT });
            var done_pictures = await model.sequelize.query
                ("select * from pictures WHERE pro_id = ? and pic_status = 'done' ",
                { replacements: [pro_id], type: sequelize.QueryTypes.SELECT });
            var items_catagory_views = await model.sequelize.query
                ("select P.ID,P.pic_id,item_name,type,group_name from pictures_items_relation as P,items_catagory_view where P.ID = items_catagory_view.ID and P.pic_id = ? ",
                { replacements: [pid], type: sequelize.QueryTypes.SELECT });
            // var items_catagory_views = await model.items_catagory_view.findAll({
            //     where: {
            //         pic_id: pid
            //     }
            // });
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
                        if (w.attr_name === q.attrName) {
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
                        attribute_obj.attr_values.push(q.attrValue);
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
            var done_pictures_datas = [];
            for (let q of done_pictures) {
                var done_pictures_data = {
                    path: q.pic_path,
                    items: new Array()
                };
                for (let w of done_pictures_items) {
                    if (w.pic_id == q.pic_id) {
                        var done_pictures_items_data = {
                            ID: w.ID,
                            type: w.cata_name
                        }
                        done_pictures_data.items.push(done_pictures_items_data);
                    }
                }
                done_pictures_datas.push(done_pictures_data);
            }
            //console.log(done_pictures);//抽出pic_path
            //console.log(done_pictures_datas[0].items);
            res.render("label", {
                title: "Label Page",
                path: path,
                items: items_datas,
                groups: groups_datas,
                done_pictures: done_pictures_datas
                // done_pictures_items: done_pictures_items,
                // done_pictures: done_pictures,
                // pic_id: pid
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
            if (p.option == 'update') {
                attrtable.destroy({
                    where: {
                        ID: p.ID
                    }
                }).then(function () {
                    //item update
                    item.update({
                        item_name: p.item_name,
                        cata_id: p.type_id,
                        createTime: Date.now()
                    }, {
                            where: {
                                ID: p.ID
                            }
                        });
                    //attrTable update
                    for (let q of p.attributes) {
                        var attrn_id = q.attrn_id;
                        for (let w of q.attrv_ids) {
                            attrtable.create({
                                ID: p.ID,
                                attrn_id: attrn_id,
                                attrv_id: w
                            }).then(function (p) {
                                console.log('updated.' + JSON.stringify(p));
                            }).catch(function (err) {
                                console.log('failed: ' + err);
                            });
                        }
                    }
                });
            }
            else if (p.option == 'delete') {
                var sequelize = model.sequelize;
                sequelize.query('delete from pictures_items_relation where ID = ? ',
                    { replacements: [p.ID], type: sequelize.QueryTypes.DELETE }
                ).then(projects => {
                    sequelize.query('delete from monthlysales where ID = ? ',
                        { replacements: [p.ID], type: sequelize.QueryTypes.DELETE }
                    ).then(projects => { });
                    sequelize.query('delete from annualsales where ID = ? ',
                        { replacements: [p.ID], type: sequelize.QueryTypes.DELETE }
                    ).then(projects => { });
                    model.sales.destroy({
                        where: {
                            ID: p.ID
                        }
                    }).then(function (g) {
                        attrtable.destroy({
                            where: {
                                ID: p.ID
                            }
                        }).then(function (z) {
                            console.log('deleted :' + JSON.stringify(z));
                            item.destroy({
                                where: {
                                    ID: p.ID
                                }
                            }).then(function (e) {
                                console.log('deleted :' + JSON.stringify(e));
                            }).catch(function (err) {
                                console.log('failed: ' + err);
                            });
                        }).catch(function (err) {
                            console.log('failed: ' + err);
                        });
                    }).catch(function (err) {
                        console.log('failed: ' + err);
                    });
                });
            } else if (p.option == 'insert'){
                //生成ID：例如某一款连衣裙的ID为1723001，是指17年第2季度连衣裙（种类编号为3）的001款）
                //我这里与原需求不同，第二季度改成了pic_id，001款被去掉了
                var handled_ID = year + pid + p.type_id;
                item.create({
                    ID: handled_ID,
                    item_name: p.item_name,
                    cata_id: p.type_id,
                    createTime: Date.now()
                }).then(function (z) {
                    var sequelize = model.sequelize;
                    sequelize.query('insert into pictures_items_relation(ID,pic_id)values(:ID,:pic_id) ',
                        { replacements: { ID: [z.ID], pic_id: [pid] }, type: sequelize.QueryTypes.INSERT }
                    ).then(projects => {
                        console.log(projects)
                    });
                    console.log('created.' + JSON.stringify(z));
                    for (let q of p.attributes) {
                        var attrn_id = q.attrn_id;
                        for (let w of q.attrv_ids) {
                            attrtable.create({
                                ID: z.ID,
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
            } else {//同款 ----->创建关联
                console.log(p);
                // (async () => {
                //     var sequelize = model.sequelize;
                //     await sequelize.query('insert into pictures_items_relation(ID,pic_id)values(:ID,:pic_id) ',
                //         { replacements: { ID: [p.ID], pic_id: [pid] }, type: sequelize.QueryTypes.INSERT }
                //     );
                // })();
            }
        }
        (async () => {
            await model.pictures.update({
                pic_status: 'done',
            }, {
                    where: {
                        pic_id: pid
                    }
                });
            res.send(200);
        })();
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
    router.route("/same_item_photos")
        .post(function (req, res) {
            //console.log(req.body);
            res.render('ejs/sameitem.ejs', req.body);
        });
    router.route("/same_item")
        .post(function (req, res) {
            // var same_item = JSON.parse(req.body.same_item);
            // var sequelize = model.sequelize;
            (async () => {
                var sequelize = model.sequelize;
                var items_catagory_views = await sequelize.query
                    ("select * from items_catagory_view where ID = ? ",
                    { replacements: [req.body.ID], type: sequelize.QueryTypes.SELECT });
                var items_attributes_views = await model.items_attributes_view.findAll({
                    where: {
                        ID: req.body.ID
                    }
                });
                var items_data = {
                    item_name: items_catagory_views[0].item_name,
                    type: items_catagory_views[0].type,
                    group: items_catagory_views[0].group_name,
                    attributes: new Array(),
                    is_same_items: true
                }
                for (let q of items_attributes_views) {
                    var exist = false;
                    for (let w of items_data.attributes) {
                        if (w.attr_name === q.attrName) {
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
                        attribute_obj.attr_values.push(q.attrValue);
                        items_data.attributes.push(attribute_obj);
                    }
                }
                console.log(items_data);
                res.render('ejs/label.ejs', {'items': [items_data]});
            })();
            // sequelize.query('insert into pictures_items_relation(ID,pic_id)values(:ID,:pic_id) ',
            //     { replacements: { ID: [same_item.ID], pic_id: [same_item.pic_id] }, type: sequelize.QueryTypes.INSERT }
            // ).then(projects => {
            //     console.log(projects)
            // });
            // (async () => {
            //     await model.pictures.update({
            //         pic_status: 'done',
            //     }, {
            //             where: {
            //                 pic_id: same_item.pic_id
            //             }
            //         });
            // })();
        });
}


module.exports = label;