const User = require('../models/userModel');

// Register new user
exports.registerUser = async (req, res) => {
    try {
        // You may want to add validation and password hashing here
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'Registration successful', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all users (optional, for admin use)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user (user can update their own profile)
exports.updateUser = async (req, res) => {
    try {
        // You should check if req.user.id === req.params.id for security
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete user (user can delete their own account)
exports.deleteUser = async (req, res) => {
    try {
        // You should check if req.user.id === req.params.id for security
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get total price of items in user's cart
exports.getCartTotalPrice = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Assuming user.cart is an array of items with a 'price' and 'quantity' field
        const totalPrice = user.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        res.json({ totalPrice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};