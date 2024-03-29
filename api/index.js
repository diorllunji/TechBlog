import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import sequelize from './utils/sequelize.js';
import './utils/sync-db.js';

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

sequelize.authenticate() // Test MySQL connection
  .then(() => {
    console.log('MySQL is connected');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});
