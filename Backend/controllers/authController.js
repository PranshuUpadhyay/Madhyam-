import db from '../models/index.js';
import bcrypt from 'bcryptjs';

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    // Check if user exists
    const existing = await db.User.findOne({ where: { [db.sequelize.Op.or]: [{ email }, { username }] } });
    if (existing)
      return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await db.User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'Sign-up successful' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await db.User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}