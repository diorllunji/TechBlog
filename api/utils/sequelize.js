// sequelize.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('TechBlog', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

export default sequelize;
