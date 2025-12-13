require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

connectDB();

// Route Mapping - These paths are used by the frontend ApiService
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
// app.use('/api/problem', require('./routes/problem'));

// Update the root message for thematic consistency
app.get('/', (req, res) => {
  res.json({ 
    message: 'Poké Centre Network API is running and ready for Trainers.', // Themed welcome message
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

module.exports = app;