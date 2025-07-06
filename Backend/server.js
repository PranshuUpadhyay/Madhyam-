import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import sequelize from './db.js';
import db from './models/index.js';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import vendorsRoutes from './routes/vendors.js';
import specialsRoutes from './routes/specials.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', vendorsRoutes);
app.use('/api', specialsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Madhyam backend is running!' });
});

// Sync DB and Start Server
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // { force: true } to reset tables
    console.log('Postgres connected and models synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Postgres connection error:', err);
  }
})();