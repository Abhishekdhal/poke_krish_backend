require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./middleware/database');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', connectDB);

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: ' Auth API is running',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server is running locally on port ${PORT}`));
}

module.exports = app;