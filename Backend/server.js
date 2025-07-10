import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import donorRoutes from './routes/donors.js';
import blogRoutes from './routes/blogs.js';
import specialsRoutes from './routes/specials.js';
import contactRoutes from './routes/contact.js';
import vendorRoutes from './routes/vendors.js';
import volunteerRoutes from './routes/volunteers.js';

// Import database connection and models
import sequelize from './db.js';
import './models/index.js'; // Import all models to register them

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          'https://madhyam.onrender.com',
          'https://madhyam-frontend.onrender.com', 
          'https://madhyam.vercel.app',
          'https://madhyam-backend.onrender.com'
        ]
      : [
          'http://localhost:3000', 
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001'
        ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// CORS debugging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    next();
  });
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'Madhyam Backend is running',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/specials', specialsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/volunteers', volunteerRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Database Validation Error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Database synchronization function
const syncDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync database schema with models
    console.log('🔄 Syncing database schema...');
    
    // First try to sync with alter (adds missing columns)
    try {
      await sequelize.sync({ force: false, alter: true });
      console.log('✅ Database schema synchronized with alter mode');
    } catch (alterError) {
      console.log('⚠️ Alter sync failed, trying force sync...');
      // If alter fails, try force sync (creates tables if they don't exist)
      await sequelize.sync({ force: false });
      console.log('✅ Database schema synchronized with force mode');
    }
    
    console.log('✅ Database schema synchronized successfully!');
    
    // Log table information
    const tables = await sequelize.showAllSchemas();
    console.log('📊 Available tables:', tables.map(t => t.name));
    
    // Check if Donor table has required columns
    try {
      const [results] = await sequelize.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Donors' 
        ORDER BY ordinal_position;
      `);
      console.log('📋 Donor table columns:', results.map(r => `${r.column_name} (${r.data_type})`));
    } catch (checkError) {
      console.log('⚠️ Could not check Donor table columns:', checkError.message);
    }
    
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    console.error('Full sync error:', error);
    // Don't exit the process, just log the error
    console.log('⚠️ Server will continue without database sync');
  }
};

// Start server with database sync
const startServer = async () => {
  try {
    // Sync database first
    await syncDatabase();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log(`🚀 Madhyam Backend server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      
      // Development environment warnings
      if (process.env.NODE_ENV !== 'production') {
        console.log('\n🔧 Development Mode Active:');
        console.log(`- JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️ Using fallback (set JWT_SECRET in .env)'}`);
        console.log(`- Database: ${process.env.PG_HOST ? '✅ Configured' : '⚠️ Using defaults (set PG_* vars in .env)'}`);
        console.log('\n📝 Create a .env file with:');
        console.log('NODE_ENV=development');
        console.log('JWT_SECRET=your-secret-key');
        console.log('PG_HOST=localhost');
        console.log('PG_USER=postgres');
        console.log('PG_PASSWORD=your_password');
        console.log('PG_DB=madhyam_db');
      }
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app; 
