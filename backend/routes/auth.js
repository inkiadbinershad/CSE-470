const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log('Signup attempt:', { name, email, phone: phone || 'not provided' });
  
  if (!name || !email || !password) {
    console.log('Signup failed: Missing required fields');
    return res.status(400).json({ error: 'All fields required' });
  }
  
  try {
    const hashed = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.create({ name, email: normalizedEmail, password: hashed, phone: phone || '' });
    console.log('Signup successful:', { userId: user._id, email: user.email });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
  } catch (err) {
    console.error('Signup error:', err.message);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: 'Registration failed: ' + err.message });
    }
  }
});

// Login
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('User found:', user ? { userId: user._id, email: user.email } : 'No user found');
    
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(400).json({ error: 'User not found' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', valid);
    
    if (!valid) {
      console.log('Login failed: Invalid password for email:', email);
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: !!user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    console.log('Login successful:', { userId: user._id, email: user.email });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, isAdmin: !!user.isAdmin } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

module.exports = router;