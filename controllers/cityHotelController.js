const multer = require('multer');
const sharp = require('sharp');
const CityHotel = require('../models/cityHotelModel');
const City = require('../models/cityModel');
const Hotel = require('../models/hotelModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadHotelImages = upload.fields([
  { name: 'singleImage', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]);

exports.resizeHotelImages = catchAsync(async (req, res, next) => {
  if (!req.files.singleImage && !req.files.images) return next();

  const cityHotel = await CityHotel.findById(req.params.id);
  if (!cityHotel) {
    return next(new AppError('There is no document found with that id!', 404));
  }

  if (req.files.singleImage) {
    req.body.singleImage = `${cityHotel.hotel.slug}-${
      cityHotel.city.slug
    }-${Date.now()}-single.jpg`;
    await sharp(req.files.singleImage[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/hotels/${req.body.singleImage}`);
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `${cityHotel.hotel.slug}-${
          cityHotel.city.slug
        }-${Date.now()}-${i + 1}.jpg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/hotels/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getAllCitiesHotels = catchAsync(async (req, res, next) => {
  //const allCitiesHotels = await CityHotel.find();
  const allCitiesHotels = await new APIFeatures(CityHotel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate().query;

  res.status(200).json({
    status: 'success',
    numCitiesHotels: allCitiesHotels.length,
    data: {
      allCitiesHotels
    }
  });
});

exports.getCityHotel = catchAsync(async (req, res, next) => {
  const cityHotel = await CityHotel.findById(req.params.id);
  if (!cityHotel) {
    return next(new AppError('There is no city hotel with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      cityHotel
    }
  });
});

exports.createCityHotel = catchAsync(async (req, res, next) => {
  if (
    !(await City.findById(req.body.city)) ||
    !(await Hotel.findById(req.body.hotel))
  ) {
    return next(new AppError('Invalid city or hotel id!', 400));
  }

  const newCityHotel = await CityHotel.create({
    city: req.body.city,
    hotel: req.body.hotel,
    distance: req.body.distance,
    mapLocation: req.body.mapLocation,
    priceOfNight: req.body.priceOfNight,
    singleImage: req.body.singleImage,
    images: req.body.images
  });

  res.status(201).json({
    status: 'success',
    message: 'New City Hotel is created!',
    data: {
      newCityHotel
    }
  });
});

exports.updateCityHotel = catchAsync(async (req, res, next) => {
  if (
    (req.body.city || req.body.hotel) &&
    (!(await City.findById(req.body.city)) ||
      !(await Hotel.findById(req.body.hotel)))
  ) {
    return next(new AppError('Invalid city or hotel id!', 400));
  }

  const cityHotel = await CityHotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!cityHotel) {
    return next(new AppError('There is no city hotel with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'City Hotel is updated!',
    data: {
      cityHotel
    }
  });
});

exports.deleteCityHotel = catchAsync(async (req, res, next) => {
  const cityHotel = await CityHotel.findByIdAndDelete(req.params.id);
  if (!cityHotel) {
    return next(new AppError('There is no city hotel with that id.', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'City Hotel is deleted!',
    data: null
  });
});

exports.getCityHotels = catchAsync(async (req, res, next) => {
  const city = await City.findOne({ slug: req.params.cityName });
  if (!city) {
    return next(new AppError('There is no city with that name.', 400));
  }

  const cityHotels = await CityHotel.find({ city: city.id });

  res.status(200).json({
    status: 'success',
    numCityHotels: cityHotels.length,
    data: {
      cityHotels
    }
  });
});

exports.getHotelCities = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findOne({ slug: req.params.slug });
  if (!hotel) {
    return next(new AppError('There is no hotel with that name.', 400));
  }

  const hotelCities = await CityHotel.find({ hotel: hotel.id }).select('city');

  res.status(200).json({
    status: 'success',
    numHotelCities: hotelCities.length,
    data: {
      hotelCities
    }
  });
});
