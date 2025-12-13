const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const professorMiddleware = require('../middleware/admin'); 
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, language } = req.body;

        if (!name || !email || !password || !language) {
            return res.status(400).json({ success: false, message: 'Please enter all required Trainer fields' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Trainer ID already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            name, 
            email, 
            phone: phone || '', 
            password: hashedPassword, 
            language,
            role: 'trainer'
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'Trainer ID created successfully. Welcome to the PokéKrishi Network!',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, language: newUser.language }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        const errorMessage = process.env.NODE_ENV !== 'production' ? error.message : 'Server error';
        res.status(500).json({ success: false, message: errorMessage });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter your Trainer ID (email) and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Trainer ID not found. Please register.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: 'Login successful. Welcome back, Trainer!',
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, language: user.language }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { name, phone, language } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (language) updates.language = language;

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');

        res.json({ success: true, message: 'Trainer profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/users', authMiddleware, professorMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;