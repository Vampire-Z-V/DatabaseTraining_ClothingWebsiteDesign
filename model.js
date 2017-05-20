var config = require('./config');
var Sequelize = require('squelize');

//创建sequelize对象
var sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host;
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

var model = {};

model.user = sequelize.define('user', 	{
	ID: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.STRING(20),
	password: Sequelize.STRING(20)
});

module.exports = model;