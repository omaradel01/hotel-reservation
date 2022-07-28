const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
//const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const hotelRouter = require('./routes/hotelRoutes');
const cityRouter = require('./routes/cityRoutes');
const cityHotelRouter = require('./routes/cityHotelRoutes');
const userRouter = require('./routes/userRoutes');
const reservationRouter = require('./routes/reservationRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/cities', cityRouter);
app.use('/api/v1/cities-hotels', cityHotelRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/', viewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
