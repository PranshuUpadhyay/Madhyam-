import sequelize from './db.js';
import './models/index.js'; // Import all models to register them
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Initializing database...');
console.log('Environment:', process.env.NODE_ENV || 'development');

const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync database schema
    if (process.env.NODE_ENV === 'production') {
      // Production: Safe sync that adds missing columns
      await sequelize.sync({ alter: true });
      console.log('✅ Production database schema synchronized');
    } else {
      // Development: More flexible sync
      await sequelize.sync({ alter: true });
      console.log('✅ Development database schema synchronized');
    }

    // Log table information
    const tables = await sequelize.showAllSchemas();
    console.log('📊 Database tables:', tables.map(t => t.name));

    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
};

// Run initialization
initializeDatabase(); 