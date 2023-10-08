const Sequelize = require('sequelize');
const db = require('../util/database');

const tableName = 'cart';
const Cart = db.define(tableName, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
