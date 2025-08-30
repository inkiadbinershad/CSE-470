const mongoose = require('mongoose');
const User = require('../models/user.model');

async function clearUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tendorra', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error clearing users:', err);
    process.exit(1);
  }
}

clearUsers();
