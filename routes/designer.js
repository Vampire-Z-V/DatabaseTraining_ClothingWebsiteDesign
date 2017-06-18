var url = require('url');
var query = require('querystring');

var designer = function (router, model) {
	router.route("/designer")
		.get(function (req, res) {
			if (!req.session.user) {
				req.session.error = "请先登录";
				res.redirect('/index');
			}
			(async () => {
				var items_sales_data = new Array();
				var groups_datas = new Array();
				var items_sales_views = await model.items_sales_view.findAll({});
				for (let p of items_sales_views) {
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
						region_id: p.region_id,
						channel: p.channel,
						agegroup: p.agegroup,
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
					items_sales_data.push(items_data);
				}
				res.render("designer", {
					title: "Designer Page",
					items_sales_data: items_sales_data,
				});
			})();
		});
	router.route("/designer/item_detail")
		.get(function (req, res) {
			if (!req.session.user) {
				req.session.error = "请先登录";
				res.redirect('/index');
			}
			var string = url.parse(req.url).query;
			var object = query.parse(string);
			var id = parseInt(object.id);
			var sequelize = model.sequelize;
			sequelize.query("SELECT * FROM `annualsales` WHERE ID = ?",
				{ replacements: [id], type: sequelize.QueryTypes.SELECT })
				.then(annualsales => {
					sequelize.query("SELECT * FROM `monthlysales` WHERE ID = ?",
						{ replacements: [id], type: sequelize.QueryTypes.SELECT })
						.then(monthlysales => {
							console.log(monthlysales);
							res.render("item_detail", {
								title: "item_detail Page",
								annualsales: annualsales,
								monthlysales: monthlysales
							});
						});
				});
		});
};


module.exports = designer;