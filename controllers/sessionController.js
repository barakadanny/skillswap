const fs = require('fs');

const learningSession = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/learningsession-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`session id is: ${val}`);

  if (req.params.id * 1 > learningSession.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.subject || !req.body.summary) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or summary',
    });
  }
  next();
};

exports.getAllSessions = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: learningSession.length,
    data: {
      learningSession,
    },
  });
};

exports.getSession = (req, res) => {
  console.log(req.params);

  res.status(200).json({
    status: 'success',
    data: {
      learningSession,
    },
  });
};

exports.createSession = (req, res) => {
  //console.log(req.body);
  const newId = learningSession[learningSession.length - 1].id + 1;
  const newLearningSession = Object.assign({ id: newId }, req.body);
  learningSession.push(newLearningSession);
  fs.writeFile(
    `${__dirname}/dev-data/data/learningsession-simple.json`,
    JSON.stringify(learningSession),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          learningSession: newLearningSession,
        },
      });
    }
  );
};

exports.updateSession = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      learningSessions: '<Updated learningSessions here...>',
    },
  });
};

exports.deleteSession = (req, res) => {
  console.log(req.params);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
