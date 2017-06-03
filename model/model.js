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
	}
});

var model = {};

//这里第一个参数为'user'，对应的数据库表为users
model.user = sequelize.define('user', {
	ID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
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
model.picture = sequelize.define('pictures', {
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
model.item = sequelize.define('items', {
	ID: {
		type: Sequelize.STRING,
		primaryKey: true,
		autoIncrement: true
	},
	cata_id: Sequelize.INTEGER,
	pic_id: Sequelize.INTEGER,
	createTime: Sequelize.DATE
},
	{
		'freezeTableName': true,
		'timestamps': false
	});

module.exports = model;