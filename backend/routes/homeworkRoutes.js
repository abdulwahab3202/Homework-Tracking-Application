const express = require('express');
const router = express.Router();
const { protect, isFaculty, isStudent } = require('../middleware/authMiddleware');
const Homework = require('../models/Homework');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|docx|txt/;
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only .png, .jpg, .jpeg, .pdf, .docx, or .txt are supported.'), false);
  }
};
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10000000 }
});
router.post('/', protect, isFaculty, upload.single('homeworkFile'), async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Please enter both title and description' });
  }
  try {
    const newHomework = new Homework({
      title,
      description,
      postedBy: req.user._id,
      dueDate: dueDate || null,
      filePath: req.file ? req.file.path : null,
    });
    const homework = await newHomework.save();
    const populatedHomework = await Homework.findById(homework._id).populate('postedBy', 'username');
    res.status(201).json(populatedHomework);
  } catch (err) {
    if (err.message.includes('File type not allowed')) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).send('Server error creating homework');
  }
});
router.get('/', protect, async (req, res) => {
  try {
    const homeworks = await Homework.find()
      .populate('postedBy', 'username')
      .sort({ datePosted: -1 });
    res.json(homeworks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching homeworks');
  }
});
router.put('/:id/complete', protect, isStudent, async (req, res) => {
  try {
    let homework = await Homework.findById(req.params.id);
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    if (homework.completions.some(id => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Homework already marked as complete' });
    }
    homework.completions.push(req.user._id);
    await homework.save();
    const updatedHomework = await Homework.findById(req.params.id).populate('postedBy', 'username');
    res.json(updatedHomework);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error marking homework as complete');
  }
});
router.get('/:id/status', protect, isFaculty, async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id)
      .populate('completions', 'username')
      .select('title description completions');
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    const allStudents = await User.find({ role: 'student' }).select('username');
    const completedStudentIds = new Set(homework.completions.map(c => c._id.toString()));
    const completedStudents = [];
    const notCompletedStudents = [];
    allStudents.forEach(student => {
      if (completedStudentIds.has(student._id.toString())) {
        completedStudents.push(student);
      } else {
        notCompletedStudents.push(student);
      }
    });
    res.json({
      _id: homework._id,
      title: homework.title,
      description: homework.description,
      completedStudents,
      notCompletedStudents,
      completionsCount: completedStudents.length,
      totalStudents: allStudents.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching homework status');
  }
});
router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  try {
    const homework = await Homework.findById(req.params.id);
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    const newComment = {
      user: req.user._id,
      username: req.user.username,
      role: req.user.role,
      text: text,
    };
    homework.comments.unshift(newComment); 
    await homework.save();
    const updatedHomework = await Homework.findById(homework._id).populate('postedBy', 'username');
    res.status(201).json(updatedHomework);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error adding comment');
  }
});
module.exports = router;