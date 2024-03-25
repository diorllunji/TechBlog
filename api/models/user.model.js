import { DataTypes } from 'sequelize';
import Sequelize from 'sequelize';

const sequelize = new Sequelize('TechBlog', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
  });

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default User;
