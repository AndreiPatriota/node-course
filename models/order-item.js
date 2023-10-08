const Sequelize = require('sequelize');
const db = require('../util/database');

const tableName = 'orderItem';
const OrderItem = db.define(tableName, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
