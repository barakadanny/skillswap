const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'A session must have a subject'],
  },
  maxParticipant: {
    type: Number,
    required: [true, 'A session must have a max participant'],
  },
  summary: {
    type: String,
    required: [true, 'A session must have a summary'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A session must have a description'],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A session must have a image cover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  Date: [Date],
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
