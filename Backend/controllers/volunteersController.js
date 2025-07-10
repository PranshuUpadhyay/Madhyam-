import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerVolunteer(req, res) {
  try {
    const { firstName, lastName, email, password, role, organization } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    const existing = await db.Volunteer.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Volunteer with this email already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const volunteer = await db.Volunteer.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role,
      organization
    });
    res.status(201).json({ message: 'Volunteer registered successfully!', volunteer: { id: volunteer.id, email: volunteer.email } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register volunteer', error: err.message });
  }
}

export async function loginVolunteer(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const volunteer = await db.Volunteer.findOne({ where: { email } });
    if (!volunteer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, volunteer.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: volunteer.id, email: volunteer.email, role: volunteer.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful',
      volunteer: {
        id: volunteer.id,
        email: volunteer.email,
        firstName: volunteer.firstName,
        lastName: volunteer.lastName,
        role: volunteer.role,
        organization: volunteer.organization
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

export async function getAllVolunteers(req, res) {
  try {
    const volunteers = await db.Volunteer.findAll();
    res.json({ success: true, data: volunteers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch volunteers', error: err.message });
  }
} 