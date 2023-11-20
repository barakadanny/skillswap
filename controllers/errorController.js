module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({
    status: err.status,
    message,
    data,
  });
};
