const HTTPStatusCode = require('http-status-code');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err, req) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  //console.log(err);
  //console.log(req.originalUrl);
  let message = '';
  if (err.keyPattern.email) {
    message = `The email ${value} is taken. Please try another one!`;
    return new AppError(message, 400);
  }
  if (
    req.originalUrl.includes(
      `tours/${value.substring(1, value.length - 1)}/reviews`
    )
  ) {
    message = `You can't make multiple reviews on the same tour! You can go and edit your review on this tour.`;
    return new AppError(message, 400);
  }
  message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired. Please login again!', 401);

const sendErrorDev = async (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Rendered website
  console.error('ERROR 💥', err);

  if (req.cookies && req.cookies.jwt) {
    const user = await User.findById(jwt.decode(req.cookies.jwt).id);
    return res.status(err.statusCode).render('error', {
      user,
      title: `${err.statusCode} ${HTTPStatusCode.getMessage(err.statusCode)}`,
      msg: err.message,
      HTTPMessage: `${err.statusCode} ${HTTPStatusCode.getMessage(
        err.statusCode
      )}`
    });
  }

  return res.status(err.statusCode).render('error', {
    title: `${err.statusCode} ${HTTPStatusCode.getMessage(err.statusCode)}`,
    msg: err.message,
    HTTPMessage: `${err.statusCode} ${HTTPStatusCode.getMessage(
      err.statusCode
    )}`
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // Rendered Website
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).render('error', {
      title: `${err.statusCode} ${HTTPStatusCode.getMessage(err.statusCode)}`,
      msg: err.message,
      HTTPMessage: `${err.statusCode} ${HTTPStatusCode.getMessage(
        err.statusCode
      )}`
    });
  }
  // Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err, req);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJwtExpiredError();
    sendErrorProd(error, req, res);
  }
};
