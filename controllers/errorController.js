const AppError = require('./../utils/appError');

/**
 * @file errorController.js
 * @description Controller for handling errors in the Express middleware.
 *
 * TODO:
 
 * - Flag errors to identify their importance: critical, medium, or less important.
 * - Implement email notification to the administrator whenever an important error occurs.
 *
 * Step-by-step instructions:
 * 1. To flag errors based on their importance, use the `isOperational` property of the error object.
 *    - Set `isOperational` to `true` for critical errors that require immediate attention.
 *    - Set `isOperational` to `false` for less important errors.
 *    - Modify the `handleCastErrorDB`, `handleDuplicateFieldsDB`, and `handleValidationErrorDB` functions to set `isOperational` accordingly.
 * 2. To implement email notification to the administrator for important errors, follow these steps:
 *    - Inside the `sendErrorProd` function, add a condition to check if the error is critical (use the `isOperational` property).
 *    - If the error is critical, send an email notification to the administrator using your preferred email library or service.
 *    - Provide appropriate instructions or placeholders to configure the email notification with the administrator's email address and other necessary details.
 *    - Make sure to handle any errors that may occur during the email sending process.
 * 3. Test the error handling and email notification functionality in a production environment to ensure it works as expected.
 */

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  // return new AppError(message, 400);
  const appError = new AppError(message, 400);
  appError.isOperational = true;
  return appError;
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate field value '${value}' for ${field}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el, index) => {
    const errorNumber = index + 1;
    return `${errorNumber}) ${el.message}`;
  });
  const message = `Invalid input data: ${errors.join('. ')}`;
  const appError = new AppError(message, 400);

  appError.isOperational = true;
  return appError;
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

/**
 * Handles errors in the Express middleware.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 *
 * @description In production, this function checks the error type and sends an appropriate response to the client.
 * To add a new error for a specific thing in production:
 * - Define a new error object with the necessary properties.
 * - If the error needs to be handled differently based on its kind, check the error's kind property.
 * - If the error needs to be handled differently based on its name, check the error's name property.
 * - If the error needs to be handled differently based on its code, check the error's code property.
 * - Send the error to the sendErrorProd function for further processing and response.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // check if the error name is equal to CastError, console log a short message

    if (err.name === 'CastError') {
      console.log('kkkkkkkkkkkkkkkkkkkkkk');
    }
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
