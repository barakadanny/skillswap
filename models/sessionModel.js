const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

/**
 * TODO:
 *
 * - Add validation for session date
 * - Add session duration
 * - Add session price when it requires payment
 * - Add session Notes: the moderator can add notes to the session
 * - Add session rating
 * - Add session comments
 * - Add session tags
 * - Add session reviews
 *
 */

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
  sessionUrl: {
    type: String,
    required: [true, 'A session must have a meeting url'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // validate the date
  // date: [Date],
  date: {
    type: Date,
    required: [true, 'A session must have a date'],
    validate: {
      validator: function (value) {
        // Check if the date is not in the past
        return value >= new Date();
      },
      message: 'Session date must be in the future',
    },
  },
  moderators: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  // Field to store the user ID who created the session
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A session must have a user'],
  },
});

sessionSchema.index({ maxParticipant: 1 });
sessionSchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before save() and create()
sessionSchema.pre('save', function (next) {
  this.slug = slugify(this.subject, { lower: true });
  next();
});

sessionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'moderators',
    select: '-__v -passwordChangedAt',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
