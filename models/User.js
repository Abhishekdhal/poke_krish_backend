const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    default: '' // Renamed to Pokégear Number in the UI
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  // Added language field to maintain API contract
  language: { 
    type: String,
    default: 'en'
  },
  role: {
    type: String,
    // Define allowed roles for validation and clarity
    enum: ['trainer', 'professor'], 
    // Defaulting to 'trainer' (was 'user')
    default: 'trainer' 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;