const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // set security HTTP headers
const mongoSanitize = require('express-mongo-sanitize'); // sanitize user input from malicious MongoDB operators
const xss = require('xss-clean'); // clean user input from malicious HTML code

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const sessionRouter = require('./routes/sessionRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARE
// * Set security HTTP headers
app.use(helmet());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
/**
 * TODO:
 *
 * - Increase limiter when the user has a premium account
 * eg:
 */
// Limit requests from the same IP
const limiter = rateLimit({
  max: 1000, // 1000 requests from the same IP in 1 hour
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // limit the size of the body to 10kb
// app.use(cookieParser()); // parse the cookie header and body into req.body and req.headers

// Data sanitization against NoSQL query injection
// (e.g. { "email": { "$gt": "" }, "password": "password1234" })
// (e.g. { "email": { "$gt": "" }, "password": { "$gt": "" } })
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
