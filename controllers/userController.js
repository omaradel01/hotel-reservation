const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You cannot update your password from this request. To update your password please use /updateMyPassword',
        400
      )
    );
  }

  const filteredBody = {};
  const excludedFields = ['role'];
  Object.keys(req.body).forEach((key) => {
    if (!excludedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: 'success',
    numUsers: allUsers.length,
    data: {
      allUsers
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError('There is no user found with that id!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'new user is created!',
    data: {
      newUser
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user)
    return next(new AppError('There is no user found with that id.', 404));

  res.status(200).json({
    status: 'success',
    message: 'user data is updated',
    data: {
      user
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser)
    return next(new AppError('There is no user found with that id!', 404));

  res.status(204).json({
    status: 'success',
    message: 'user is deleted',
    data: null
  });
});
