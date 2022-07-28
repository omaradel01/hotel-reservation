/* eslint-disable no-else-return */
const User = require('../models/userModel');
const City = require('../models/cityModel');
const CityHotel = require('../models/cityHotelModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const validSearchFields = (req) => {
  if (
    req.query.city === undefined ||
    !req.query.numberOfRooms ||
    !req.query.CheckInDate ||
    !req.query.CheckOutDate ||
    !req.query.NoOfAdults ||
    !req.query.NoOfChildren
  ) {
    return false;
  } else if (
    new Date(req.query.CheckOutDate).getTime() <
      new Date(req.query.CheckInDate).getTime() ||
    req.query.numberOfRooms < 1 ||
    req.query.NoOfAdults < 1 ||
    req.query.NoOfChildren < 0
  ) {
    return false;
  }
  return true;
};

exports.getOverview = (req, res, next) => {
  if (req.cookies && req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    return next(new AppError('you are already logged in!', 409));
  } else {
    res.status(200).render('overview');
  }
};

exports.getLogin = (req, res, next) => {
  if (req.cookies && req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    return next(new AppError('you are already logged in!', 409));
  } else {
    res.status(200).render('login');
  }
};

exports.getSignup = catchAsync(async (req, res, next) => {
  if (req.cookies && req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    return next(new AppError('you are already logged in!', 409));
  } else {
    const allUsers = await User.find();
    const emails = [];
    const usernames = [];
    allUsers.forEach((user) => {
      emails.push(user.email);
      usernames.push(user.username);
    });
    res.status(200).render('signup', { emails, usernames });
  }
});

exports.getHome = catchAsync(async (req, res, next) => {
  if (req.user.role === 'user') {
    const cities = [];
    await (
      await City.find()
    ).forEach((city) => {
      cities.push({ name: city.name, slug: city.slug });
    });
    res.status(200).render('client', { currentUser: req.user, cities });
  } else {
    res.status(200).render('admin', { currentUser: req.user });
  }
});

exports.search = catchAsync(async (req, res, next) => {
  if (!validSearchFields(req)) {
    return next(
      new AppError(
        'You must submit a valid search form to perform this action',
        400
      )
    );
  } else {
    const city = await City.findOne({ slug: req.query.city });
    const searchHotels = !city
      ? await CityHotel.find().select(
          'city hotel priceOfNight distance singleImage name'
        )
      : await CityHotel.find({ city: city.id }).select(
          'city hotel priceOfNight distance singleImage name'
        );
    res.status(200).render('search', {
      currentUser: req.user,
      searchHotels,
      title:
        req.query.city === ''
          ? 'Hotels Hero Search'
          : `Hotels Hero Search | ${req.query.city}`
    });
  }
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).render('me', { currentUser: req.user });
});

exports.showHotel = catchAsync(async (req, res, next) => {
  const hotel = await CityHotel.findById(req.params.id);
  console.log(hotel);
  res.status(200).render('showHotel', {
    currentUser: req.user,
    title: `Hotels Hero | ${hotel.hotel.slug}-${hotel.city.slug}`,
    hotel
  });
});
