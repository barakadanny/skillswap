const Session = require('./../models/sessionModel');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getAllSessions = factory.getAll(Session);

exports.getSession = factory.getOne(Session);

exports.createSession = factory.createOne(Session);

exports.updateSession = factory.updateOne(Session);

exports.deleteSession = factory.deleteOne(Session);

exports.getSessionStats = catchAsync(async (req, res, next) => {
  const stats = await Session.aggregate([
    {
      $match: { maxParticipant: { $gte: 1 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numSessions: { $sum: 1 },
        maxParticipants: { $max: '$maxParticipant' },
        avgParticipants: { $avg: '$maxParticipant' },
        minParticipants: { $min: '$maxParticipant' },
      },
    },
    {
      $sort: { avgParticipants: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

//
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Session.aggregate([
    {
      $unwind: '$date',
    },
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        numberOfSessions: { $sum: 1 },
        sessions: { $push: '$subject' },
      },
    },
    {
      $addFields: {
        month: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'January' },
              { case: { $eq: ['$_id', 2] }, then: 'February' },
              { case: { $eq: ['$_id', 3] }, then: 'March' },
              { case: { $eq: ['$_id', 4] }, then: 'April' },
              { case: { $eq: ['$_id', 5] }, then: 'May' },
              { case: { $eq: ['$_id', 6] }, then: 'June' },
              { case: { $eq: ['$_id', 7] }, then: 'July' },
              { case: { $eq: ['$_id', 8] }, then: 'August' },
              { case: { $eq: ['$_id', 9] }, then: 'September' },
              { case: { $eq: ['$_id', 10] }, then: 'October' },
              { case: { $eq: ['$_id', 11] }, then: 'November' },
              { case: { $eq: ['$_id', 12] }, then: 'December' },
            ],
            default: 'Unknown',
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field from the output
      },
    },
    // sort from January to December
    {
      $sort: {
        month: 1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});
