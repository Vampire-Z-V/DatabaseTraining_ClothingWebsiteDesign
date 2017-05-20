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
model.user = sequelize.define('user', 	{
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

module.exports = model;