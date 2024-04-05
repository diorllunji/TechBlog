import { DataTypes } from 'sequelize';
import Sequelize from 'sequelize';

const sequelize = new Sequelize('TechBlog', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
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
  },
  profilePicture:{
    type:DataTypes.STRING,
    defaultValue:"https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png",
    allowNull:true
  },
  isAdmin:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
    allowNull:false
  }
});


export default User;
