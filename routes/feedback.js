const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // Assuming this model structure is appropriate

// @route POST /api/feedback
// @desc Submit a new Trainer Report (Feedback)
router.post('/', async (req, res) => {
    try {
        // Renaming the fields in the body for clarity and capturing the optional image URL
        const { name, message, image_url } = req.body; 

        if (!name || !message) {
            return res.status(400).json({ success: false, message: 'Please enter your name and report details' });
        }

        const newFeedback = new Feedback({ 
            name: name, 
            message: message,
            // Add the optional image_url field to the database entry
            image_url: image_url || null 
        });
        await newFeedback.save();

        res.status(201).json({ success: true, message: 'Trainer Report submitted to the Professor successfully' });
    } catch (error) {
        console.error('Trainer Report Submission Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;