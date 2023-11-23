const AppError = require('./../utils/appError');

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;

  if (process.env.NODE_ENV === 'development') {
    res.status(status).json({
      status: err.status,
      error: err,
      message,
      stack: err.stack,
      data,
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(status).json({
      status: err.status,
      message,
      data,
    });
  }
};
