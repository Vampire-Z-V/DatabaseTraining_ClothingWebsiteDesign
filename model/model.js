var config = require('./config');
var Sequelize = require('sequelize');

//创建sequelize对象
var sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	omitNull: true
});

var model = {};
//for raw queries
model.sequelize = sequelize;

//这里第一个参数为'user'，对应的数据库表为users
model.user = sequelize.define('user', {
	ID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_type: Sequelize.ENUM('系统管理员', '服装设计师', '销售管理员'),
	name: Sequelize.STRING(20),
	password: Sequelize.STRING(20),
	//因为在将sequelize函数转换为mysql语句的时候，会自动添加createdAt和updatedAt这两个属性
	//因此需要假如这两个属性，相应的在数据库的表也要有这两个属性
	createdAt: Sequelize.BIGINT,
	updatedAt: Sequelize.BIGINT
});
//打标签任务
model.project = sequelize.define('project', {
	pro_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	pro_name: Sequelize.STRING(50),
	pro_status: Sequelize.ENUM("undo", "done"),
},
	{
		// 不要加s
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});
model.pictures = sequelize.define('pictures', {
	pic_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	pic_path: Sequelize.STRING(50),
	pic_status: Sequelize.ENUM("undo", "done"),
	pro_id: Sequelize.INTEGER
},
	{
		'freezeTableName': true,
		'timestamps': false
	});
model.items = sequelize.define('items', {
	ID: {
		type: Sequelize.STRING,
		primaryKey: true,
		autoIncrement: true
	},
	item_name: Sequelize.STRING,
	cata_id: Sequelize.INTEGER,
	pic_id: Sequelize.INTEGER,
	createTime: Sequelize.DATE
},
	{
		'freezeTableName': true,
		'timestamps': false
	});
model.attrTable = sequelize.define('attrTable', {
	// attrTable_id: {
	// 	type: Sequelize.INTEGER,
	// 	primaryKey: true,
	// 	autoIncrement: true,
	// 	defaultValue:7
	// },
	ID: Sequelize.STRING,
	attrn_id: Sequelize.INTEGER,
	attrv_id: Sequelize.INTEGER
},
	{
		'freezeTableName': true,
		'timestamps': false
	});
model.attrname = sequelize.define('attrName', {
	attrn_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	attrName: Sequelize.STRING,
	cata_id: Sequelize.INTEGER
},
	{
		'freezeTableName': true,
		'timestamps': false
	});
model.sales = sequelize.define('sales', {
	ID: {
		type: Sequelize.STRING,
		primaryKey: true,
		autoIncrement: true
	}
},
	{
		'freezeTableName': true,
		'timestamps': false
	});
model.attrvalue = sequelize.define('attrValue', {
	attrv_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	attrValue: Sequelize.STRING,
	attrn_id: Sequelize.INTEGER
},
	{
		'freezeTableName': true,
		'timestamps': false
	});
model.catagory = sequelize.define('catagory', {
	cata_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	cata_name: Sequelize.STRING,
	parent_id: Sequelize.INTEGER
},
	{
		'freezeTableName': true,
		'timestamps': false
	});

model.items_catagory_view = sequelize.define('items_catagory_view', {
	item_name: Sequelize.INTEGER,
	pic_id: Sequelize.INTEGER,
	ID: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	type: Sequelize.STRING,
	group_name: Sequelize.STRING,
},
	{
		'freezeTableName': true,
		'timestamps': false
	});

model.items_sales_view = sequelize.define('items_sales_view', {
	item_name: Sequelize.INTEGER,
	pic_id: Sequelize.INTEGER,
	ID: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	type: Sequelize.STRING,
	group_name: Sequelize.STRING,
	annualsales: Sequelize.INTEGER,
	mounthlysales: Sequelize.INTEGER,
	region_id: Sequelize.INTEGER,
	channel: Sequelize.STRING,
	agegroup: Sequelize.STRING
},
	{
		'freezeTableName': true,
		'timestamps': false
	});

model.items_attributes_view = sequelize.define('items_attributes_view', {
	ID: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	attrName: Sequelize.STRING,
	attrValue: Sequelize.STRING
},
	{
		'freezeTableName': true,
		'timestamps': false
	});

model.attributes_view = sequelize.define('attributes_view', {
	cata_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	cata_name: Sequelize.STRING,
	attrn_id: Sequelize.INTEGER,
	attrName: Sequelize.STRING,
	attrv_id: Sequelize.INTEGER,
	attrValue: Sequelize.STRING,
	parent_id: Sequelize.INTEGER,
	multi: Sequelize.BOOLEAN
},
	{
		'freezeTableName': true,
		'timestamps': false
	});

module.exports = model;