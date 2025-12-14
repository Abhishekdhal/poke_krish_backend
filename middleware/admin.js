const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'professor') { 
      return res.status(401).json({ success: false, message: 'Authorization Failed: Only the Professor is authorized to access this section.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};