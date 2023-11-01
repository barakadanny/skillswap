const Session = require('./../models/sessionModel');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();

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
