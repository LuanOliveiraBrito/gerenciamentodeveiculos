import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './src/database/db.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import driverRoutes from './src/routes/driverRoutes.js';
import historyRoutes from './src/routes/historyRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database before setting up routes
await initializeDatabase();

// Routes
app.use('/api', authRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', driverRoutes);
app.use('/api', historyRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Server running on port ${PORT}`);
});
