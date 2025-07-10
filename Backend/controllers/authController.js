import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export async function signup(req, res) {
  try {
    // Check if database is connected
    if (!db.sequelize) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    // Debug: Log the incoming request data
    console.log('🔍 Signup Request Body:', req.body);
    console.log('🔍 Signup Request Headers:', req.headers);

    const { firstname, lastname, email, contact, password, role } = req.body;
    
    // Debug: Log extracted values
    console.log('🔍 Extracted Values:', {
      firstname,
      lastname,
      email,
      contact,
      password: password ? '***set***' : 'missing',
      role
    });
    
    if (!firstname || !lastname || !email || !contact || !password)
      return res.status(400).json({ message: 'All fields required' });

    // Check if user exists
    const existing = await db.User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: 'User already exists' });

    // Debug: Log the exact email value and type
    console.log('🔍 Email value:', email);
    console.log('🔍 Email type:', typeof email);
    console.log('🔍 Email length:', email ? email.length : 'null');

    // Auto-generate username
    const username = `${firstname.toLowerCase()}_${lastname.toLowerCase()}_${Math.floor(Math.random()*10000)}`;
    const hashed = await bcrypt.hash(password, 10);
    
    // Debug: Log the user data being created
    const userData = {
      username,
      email: email.trim(), // Ensure email is trimmed
      password: hashed,
      firstName: firstname,
      lastName: lastname,
      phone: contact,
      role: undefined
    };
    
    console.log('🔍 User data to create:', {
      ...userData,
      password: '***hashed***'
    });
    
    const newUser = await db.User.create(userData);
    // Generate JWT with fallback secret for development
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
    console.log('🔍 JWT Secret used:', process.env.JWT_SECRET ? 'from env' : 'fallback dev secret');
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ 
      message: 'Sign-up successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    
    // Handle Sequelize validation errors specifically
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      
      console.log('🔍 Validation Errors:', validationErrors);
      
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    // Handle other Sequelize errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        message: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
}

export async function login(req, res) {
  try {
    // Check if database is connected
    if (!db.sequelize) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await db.User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role // Added role to user object
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

export async function googleSignIn(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Missing Google credential' });

    // Verify Google token
    const googleApiUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const googleRes = await axios.get(googleApiUrl);
    const { email, given_name, family_name, picture, name } = googleRes.data;
    if (!email) return res.status(400).json({ message: 'Invalid Google token' });

    // Check if user exists
    let user = await db.User.findOne({ where: { email } });
    if (!user) {
      // Create user
      user = await db.User.create({
        email,
        firstName: given_name || name?.split(' ')[0] || 'Google',
        lastName: family_name || name?.split(' ')[1] || '',
        username: email.split('@')[0],
        phone: '',
        profileImage: picture || null,
        password: '', // No password for social login
      });
    }

    // Generate JWT with fallback secret for development
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
    res.json({
      message: 'Google sign-in successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileImage: user.profileImage
      },
      token
    });
  } catch (err) {
    console.error('Google sign-in error:', err.message);
    res.status(500).json({ message: 'Google sign-in failed', error: err.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await db.User.findAll();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}