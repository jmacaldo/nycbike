'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Plates = db.define('plates', {
  plate: {
  	type: Sequelize.STRING,
  	allowNull: false
  },
  state: {
  	type: Sequelize.STRING,
  	allowNull: false
  }

});

module.exports = Plates;
