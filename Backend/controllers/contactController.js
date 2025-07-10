import db from '../models/index.js';

export async function contactUs(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'All fields required' });

    await db.Contact.create({ name, email, message });
    res.json({ message: 'Message received, thank you!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
}