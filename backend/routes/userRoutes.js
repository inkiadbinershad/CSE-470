const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Get user profile
router.get('/profile/:id', authMiddleware, userController.getUserProfile);

// Update user profile
router.put('/profile/:id', authMiddleware, userController.updateUserProfile);

// Delete user
router.delete('/:id', authMiddleware, userController.deleteUser);

// Get all users (admin only)
router.get('/', authMiddleware, userController.getAllUsers);


module.exports = router;