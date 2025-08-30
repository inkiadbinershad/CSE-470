const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Seed/admin ensure
async function ensureAdmin() {
  const adminEmail = 'inkiadbinershad@gmail.com';
  const adminPass = '21201516';
  const adminPhone = '1234567890'; // Adding required phone number
  let user = await User.findOne({ email: adminEmail });
  const hashed = await bcrypt.hash(adminPass, 10);
  if (!user) {
    await User.create({ name: 'Admin', phone: adminPhone, email: adminEmail, password: hashed, isAdmin: true });
    console.log('Seeded admin user');
  } else {
    const needUpdate = !user.isAdmin;
    if (needUpdate) user.isAdmin = true;
    // Ensure known admin password
    user.password = hashed;
    await user.save();
    console.log('Ensured admin user');
  }
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tendorra', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');
  try { await ensureAdmin(); } catch (e) { console.error('Admin seed error', e); }
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Tendorra backend is running!');
});

// Add more routes for products, orders, wishlist, etc. here

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});