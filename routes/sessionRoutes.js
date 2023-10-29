const express = require('express');
const router = express.Router();
const sessionController = require('./../controllers/sessionController');

router.param('id', sessionController.checkId);

router
  .route('/')
  .get(sessionController.getAllSessions)
  .post(sessionController.checkBody, sessionController.createSession);

router
  .route('/:id')
  .get(sessionController.getSession)
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

module.exports = router;
