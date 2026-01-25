const express = require('express');
const router = express.Router();
const { protect, isFaculty } = require('../middleware/authMiddleware');
const User = require('../models/User');
router.get('/stats/students', protect, isFaculty, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    res.json({ totalStudents });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching student stats');
  }
});
module.exports = router;