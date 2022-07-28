const Reservation = require('../models/reservationModel');
const CityHotel = require('../models/cityHotelModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const validateReservation = (cityHotel, newReservation, next) => {
  if (
    (!newReservation.numberOfSingleRooms &&
      !newReservation.numberOfDoubleRooms &&
      !newReservation.numberOfTripleRooms) ||
    ((newReservation.numberOfSingleRooms ===
      newReservation.numberOfDoubleRooms) ===
      newReservation.numberOfTripleRooms) ===
      0
  ) {
    return next(
      new AppError('Please provide at least one room of any type', 400)
    );
  }
  if (cityHotel.singleRooms - newReservation.numberOfSingleRooms < 0) {
    return next(new AppError('Not enough single rooms are available!', 400));
  }
  if (cityHotel.doubleRooms - newReservation.numberOfDoubleRooms < 0) {
    return next(new AppError('Not enough double rooms are available!', 400));
  }
  if (cityHotel.tripleRooms - newReservation.numberOfTripleRooms < 0) {
    return next(new AppError('Not enough double rooms are available!', 400));
  }
  cityHotel.singleRooms -= newReservation.numberOfSingleRooms;
  cityHotel.doubleRooms -= newReservation.numberOfDoubleRooms;
  cityHotel.tripleRooms -= newReservation.numberOfTripleRooms;
};

exports.getAllReservations = catchAsync(async (req, res, next) => {
  const allReservations = await new APIFeatures(Reservation.find(), req.query)
    .sort()
    .filter()
    .limitFields()
    .paginate().query;

  res.status(200).json({
    status: 'success',
    numReservations: allReservations.length,
    data: {
      allReservations
    }
  });
});

exports.getReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return next(new AppError('There is no hotel with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      reservation
    }
  });
});

exports.getCurrentUserReservations = catchAsync(async (req, res, next) => {
  const currentUserReservations = await Reservation.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    numReservations: currentUserReservations.length,
    data: {
      currentUserReservations
    }
  });
});

exports.createReservation = catchAsync(async (req, res, next) => {
  if (req.body.user && !(await User.findById(req.body.user))) {
    return next(new AppError('There is no user found with that id!', 400));
  }
  if (req.body.cityHotel && !(await CityHotel.findById(req.body.cityHotel))) {
    return next(new AppError('There is no hotel found with that id!', 400));
  }

  const newReservation = new Reservation({
    user: req.body.user,
    cityHotel: req.body.cityHotel,
    type: req.body.type,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    price: req.body.price,
    numberOfAdults: req.body.numberOfAdults,
    numberOfChildren: req.body.numberOfChildren,
    numberOfSingleRooms: req.body.numberOfSingleRooms,
    numberOfDoubleRooms: req.body.numberOfDoubleRooms,
    numberOfTripleRooms: req.body.numberOfTripleRooms
  });

  const cityHotel = await CityHotel.findById(newReservation.cityHotel);
  if (cityHotel) {
    validateReservation(cityHotel, newReservation, next);
  }
  await newReservation.save();
  await cityHotel.save();

  res.status(201).json({
    status: 'success',
    message: 'Reservation is created',
    data: {
      newReservation
    }
  });
});

exports.makeReservation = catchAsync(async (req, res, next) => {
  const newReservation = new Reservation({
    user: req.user.id,
    cityHotel: req.body.cityHotel,
    type: req.body.type,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    price: req.body.price,
    numberOfAdults: req.body.numberOfAdults,
    numberOfChildren: req.body.numberOfChildren,
    numberOfSingleRooms: req.body.numberOfSingleRooms,
    numberOfDoubleRooms: req.body.numberOfDoubleRooms,
    numberOfTripleRooms: req.body.numberOfTripleRooms
  });

  const cityHotel = await CityHotel.findById(newReservation.cityHotel);

  validateReservation(cityHotel, newReservation, next);

  await newReservation.save();
  await cityHotel.save();

  res.status(201).json({
    status: 'success',
    message: 'Reservation is created',
    data: {
      newReservation
    }
  });
});

exports.updateReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!reservation) {
    return next(
      new AppError('There is no reservation found with that id!', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'reservation is updated',
    data: {
      reservation
    }
  });
});

exports.deleteReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) {
    return next(
      new AppError('There is no reservation found with that id!', 404)
    );
  }

  res.status(204).json({
    status: 'success',
    message: 'reservation is deleted',
    data: null
  });
});
