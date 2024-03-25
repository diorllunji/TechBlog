import { Sequelize } from 'sequelize';
import User from '../models/user.model.js';

// Create Sequelize instance with database configuration
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Call sync() method on each model
(async () => {
  try {
    // Sync each model
    await User.sync();

    console.log('Models synced successfully');
  } catch (error) {
    console.error('Error syncing models:', error);
  } finally {
    // Close the Sequelize connection
    await sequelize.close();
  }
})();