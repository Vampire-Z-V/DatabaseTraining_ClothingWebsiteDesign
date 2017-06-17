var designer = function (router, model) {
	router.route("/designer")
		.get(function (req, res) {
			if (!req.session.user) {
				req.session.error = "请先登录";
				res.redirect('/index');
			}
			sequelize.query("SELECT * FROM `sales`", { type: sequelize.QueryTypes.SELECT })
				.then(sales => {
					for (let p of sales) {
						sequelize.query("SELECT * FROM `annualsales` WHERE ", { type: sequelize.QueryTypes.SELECT })
							.then(annualsales => {

							});
					}
				});
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
						annualsales: p.annualsales,
						mounthlysales: p.mounthlysales,
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
};

module.exports = designer;