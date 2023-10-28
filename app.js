const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const learningSession = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/learningsession-simple.json`)
);

const getAllSessions = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: learningSession.length,
    data: {
      learningSession,
    },
  });
};

const getSession = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const learningSessions = learningSession.find((el) => el.id === id);

  if (!learningSessions) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      learningSessions,
    },
  });
};

const createSession = (req, res) => {
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

const updateSession = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const learningSessions = learningSession.find((el) => el.id === id);

  if (!learningSessions) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      learningSessions: '<Updated learningSessions here...>',
    },
  });
};

const deleteSession = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const learningSessions = learningSession.find((el) => el.id === id);

  if (!learningSessions) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/skillswap').get(getAllSessions).post(createSession);
app
  .route('/api/v1/skillswap/:id')
  .get(getSession)
  .patch(updateSession)
  .delete(deleteSession);

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
