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
    default: ''
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  language: {
    type: String,
    default: 'en'
  },
  role: {
    type: String,
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;