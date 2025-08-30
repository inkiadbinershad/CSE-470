const mongoose = require('mongoose');

// Cart item schema for user's cart
const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: "" }, // e.g., S, M, L, XL
    color: { type: String, default: "" }
});

// User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // User's name
    phone: { type: String, default: "", match: /^[0-9]{10,15}$/ }, // Phone number (optional)
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // Email address
    password: { type: String, required: true }, // Hashed password
    address: [{
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zip: { type: String, default: "" },
        country: { type: String, default: "" }
    }],
    cart: [cartItemSchema], // User's cart items
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Wishlist product IDs
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Order IDs
    createdAt: { type: Date, default: Date.now }, // Account creation date
    isAdmin: { type: Boolean, default: false } // Admin flag
});

module.exports = mongoose.model('User', userSchema);