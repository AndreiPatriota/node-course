const Sequelize = require('sequelize');

const dbName = 'node-complete';
const dbUser = 'root';
const password = '12345678';

const sequelize = new Sequelize(dbName, dbUser, password, {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
