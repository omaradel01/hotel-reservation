const Hotel = require('../models/hotelModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllHotels = catchAsync(async (req, res, next) => {
  const allHotels = await Hotel.find();

  res.status(200).json({
    status: 'success',
    numHotels: allHotels.length,
    data: {
      allHotels
    }
  });
});

exports.getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return next(new AppError('There is no hotel found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      hotel
    }
  });
});

exports.createHotel = catchAsync(async (req, res, next) => {
  const newHotel = await Hotel.create({
    name: req.body.name,
    stars: req.body.stars,
    ratingsAverage: req.body.ratingsAverage,
    numRatings: req.body.numRatings,
    image: req.body.image,
    images: req.body.images
  });

  res.status(201).json({
    status: 'success',
    message: 'A new hotel is created!',
    data: {
      newHotel
    }
  });
});

exports.updateHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!hotel) {
    return next(new AppError('There is no hotel found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Hotel is updated',
    data: {
      hotel
    }
  });
});

exports.deleteHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) {
    return next(new AppError('There is no hotel found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Hotel is deleted',
    data: null
  });
});
