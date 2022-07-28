const express = require('express');

const cityHotelController = require('../controllers/cityHotelController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/get-city-hotels/:cityName', cityHotelController.getCityHotels);
router.get('/get-hotel-cities/:slug', cityHotelController.getHotelCities);

router
  .route('/')
  .get(cityHotelController.getAllCitiesHotels)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    cityHotelController.createCityHotel
  );

router.use(authController.protect, authController.restrictToAdmin);

router
  .route('/:id')
  .get(cityHotelController.getCityHotel)
  .patch(
    cityHotelController.uploadHotelImages,
    cityHotelController.resizeHotelImages,
    cityHotelController.updateCityHotel
  )
  .delete(cityHotelController.deleteCityHotel);

module.exports = router;
