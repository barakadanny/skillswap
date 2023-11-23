const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  // return new AppError(message, 400);
  const appError = new AppError(message, 400);
  appError.isOperational = true;
  return appError;
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;

  const appError = new AppError(message, 400);
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
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
