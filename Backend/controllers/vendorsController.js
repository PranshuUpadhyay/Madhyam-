import db from '../models/index.js';

export async function listVendors(req, res) {
  try {
    const vendors = await db.Vendor.findAll();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendors', error: err.message });
  }
}

export async function addVendor(req, res) {
  try {
    const { name, address, contact, type, description } = req.body;
    if (!name || !address || !contact)
      return res.status(400).json({ message: 'Fields missing' });

    const vendor = await db.Vendor.create({ name, address, contact, type, description });
    res.status(201).json({ message: 'Vendor/Donor added', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add vendor', error: err.message });
  }
}