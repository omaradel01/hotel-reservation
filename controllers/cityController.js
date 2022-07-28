const City = require('../models/cityModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

exports.getAllCities = catchAsync(async (req, res, next) => {
  const allCites = await City.find();

  res.status(200).json({
    status: 'success',
    numCites: allCites.length,
    data: {
      allCites
    }
  });
});

exports.getCity = catchAsync(async (req, res, next) => {
  const city = await City.findById(req.params.id);
  if (!city) {
    return next(new AppError('There is no city found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      city
    }
  });
});

exports.createCity = catchAsync(async (req, res, next) => {
  const newCity = await City.create({
    name: req.body.name
  });

  res.status(201).json({
    status: 'success',
    message: 'City is created',
    data: {
      newCity
    }
  });
});

exports.updateCity = catchAsync(async (req, res, next) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!city) {
    return next(new AppError('There is no city found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      city
    }
  });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const city = await City.findByIdAndDelete(req.params.id);
  if (!city) {
    return next(new AppError('There is no city found with that id.', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'City is deleted',
    data: null
  });
});
