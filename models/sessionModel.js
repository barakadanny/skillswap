const mongoose = require('mongoose');
const slugify = require('slugify');

const sessionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'A session must have a subject'],
  },
  slug: String,
  maxParticipant: {
    type: Number,
    required: [true, 'A session must have a max participant'],
    min: [1, 'A session must have at least 1 participant'],
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
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced', 'all'],
      message: 'Difficulty is either: beginner, intermediate, advanced or all',
    },
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
  date: [Date],
});

// DOCUMENT MIDDLEWARE: runs before save() and create()
sessionSchema.pre('save', function (next) {
  this.slug = slugify(this.subject, { lower: true });
  next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
