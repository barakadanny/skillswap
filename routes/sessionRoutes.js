const express = require('express');
const router = express.Router();
const sessionController = require('./../controllers/sessionController');
const authController = require('./../controllers/authController');

router.route('/session-stats').get(sessionController.getSessionStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    sessionController.getMonthlyPlan
  );

router
  .route('/')
  .get(sessionController.getAllSessions)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    sessionController.createSession
  );

router
  .route('/:id')
  .get(sessionController.getSession)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    sessionController.updateSession
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    sessionController.deleteSession
  );

module.exports = router;
