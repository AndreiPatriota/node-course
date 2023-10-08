const Sequelize = require('sequelize');
const db = require('../util/database');

const tableName = 'user';
const User = db.define(tableName, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
