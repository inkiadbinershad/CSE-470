const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();

// Simple admin guard placeholder (replace with JWT/session later)
function requireAdmin(req, res, next) {
  const isAdminHeader = req.header('X-Admin');
  if (String(isAdminHeader).toLowerCase() === 'true') return next();
  return res.status(403).json({ error: 'Admin only' });
}

// GET /api/products?search=&category=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search = '', category, page = 1, limit = 20 } = req.query;
    const q = {};
    if (search) q.name = { $regex: String(search), $options: 'i' };
    if (category && category !== 'All') q.category = category;

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));

    const [items, total] = await Promise.all([
      Product.find(q).sort({ createdAt: -1 }).skip(skip).limit(Math.max(1, parseInt(limit, 10))),
      Product.countDocuments(q),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Math.max(1, parseInt(limit, 10)))
    });
  } catch (err) {
    console.error('Products list error', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Admin create
router.post('/', requireAdmin, async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Create failed' });
  }
});

// Admin update
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Admin delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const del = await Product.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product id' });
  }
});

// POST /api/products/seed - simple seeding route (dev only)
router.post('/seed', async (_req, res) => {
  const sample = [
    { name: 'Classic Tee', price: 25, category: 'Tops', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
    { name: 'Blue Jeans', price: 40, category: 'Bottoms', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Running Shoes', price: 60, category: 'Footwear', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hoodie', price: 55, category: 'Tops', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Chinos', price: 45, category: 'Bottoms', image: 'https://images.unsplash.com/photo-1593032457864-1b345992d1f3?auto=format&fit=crop&w=800&q=80' },
  ];
  try {
    await Product.deleteMany({});
    const created = await Product.insertMany(sample);
    res.json({ success: true, count: created.length });
  } catch (err) {
    res.status(500).json({ error: 'Seed failed' });
  }
});

module.exports = router;
