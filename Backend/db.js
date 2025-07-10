import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Handle Render's PostgreSQL environment variables
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // Production (Render) - prefer DATABASE_URL, fallback to individual variables
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Use DATABASE_URL if available
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false, // Disable logging for production performance
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  } else {
    // Fallback to individual environment variables
    const host = process.env.PG_HOST;
    const user = process.env.PG_USER;
    const password = process.env.PG_PASSWORD;
    const database = process.env.PG_DB;
    
    if (!host || !user || !password || !database) {
      console.error('Missing database configuration variables:');
      console.error('PG_HOST:', !!host);
      console.error('PG_USER:', !!user);
      console.error('PG_PASSWORD:', !!password);
      console.error('PG_DB:', !!database);
      throw new Error('Database configuration missing. Please set either DATABASE_URL or PG_HOST, PG_USER, PG_PASSWORD, PG_DB environment variables.');
    }
    
    sequelize = new Sequelize(database, user, password, {
      host: host,
      dialect: 'postgres',
      logging: false, // Disable logging for production performance
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
} else {
  // Development - use individual environment variables
  sequelize = new Sequelize(
    process.env.PG_DB || 'madhyam_db',
    process.env.PG_USER || 'postgres',
    process.env.PG_PASSWORD || 'password',
    {
      host: process.env.PG_HOST || 'localhost',
      dialect: 'postgres',
      logging: false // Disable logging for development
    }
  );
}

// Test the database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize;