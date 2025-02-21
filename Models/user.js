const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  pool: {
    max: 30,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Users',
  freezeTableName: true,
  timestamps: true
});

module.exports = { sequelize, User };