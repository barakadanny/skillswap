const express = require('express');
const morgan = require('morgan');

const sessionRouter = require('./routes/sessionRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// 2) ROUTES
app.use('/api/v1/sessions', sessionRouter);
// console.log('running');
app.use('/api/v1/users', userRouter);

// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server!`,
//   });
// });

module.exports = app;
