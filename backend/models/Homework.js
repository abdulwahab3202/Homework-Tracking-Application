const mongoose = require('mongoose');
const HomeworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  filePath: {
    type: String,
    required: false,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
      username: {
        type: String, 
        required: true 
      },
      role: {
        type: String, 
        required: true 
      },
      text: {
        type: String, 
        required: true 
      },
      date: {
        type: Date, 
        default: Date.now 
      }
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('Homework', HomeworkSchema);