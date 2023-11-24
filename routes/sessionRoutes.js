const express = require('express');
const router = express.Router();
const sessionController = require('./../controllers/sessionController');
const authController = require('./../controllers/authController');

router.route('/session-stats').get(sessionController.getSessionStats);
router.route('/monthly-plan/:year').get(sessionController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, sessionController.getAllSessions)
  .post(sessionController.createSession);

router
  .route('/:id')
  .get(sessionController.getSession)
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

module.exports = router;
