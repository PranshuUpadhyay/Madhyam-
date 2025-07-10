import sequelize from './db.js';
import './models/index.js'; // Import all models to register them
import dotenv from 'dotenv';

dotenv.config();

console.log('🔄 Starting database synchronization...');
console.log('Environment:', process.env.NODE_ENV || 'development');

const syncDatabase = async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync all models with the database
    // force: false - won't drop existing tables
    // alter: true - will add missing columns and modify existing ones
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database synchronized successfully!');
    console.log('📋 All tables and columns are now up to date');
    
    // Show table information
    const tables = await sequelize.showAllSchemas();
    console.log('📊 Available tables:', tables.map(t => t.name));
    
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
};

// Run the sync
syncDatabase(); 