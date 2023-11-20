const Session = require('./../models/sessionModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllSessions = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Session.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const sessions = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        session,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

exports.createSession = async (req, res) => {
  try {
    const newSession = await Session.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        session: newSession,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent to server',
    });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        session,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent to server',
    });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

exports.getSessionStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
