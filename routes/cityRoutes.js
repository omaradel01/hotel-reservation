const express = require('express');
const cityController = require('../controllers/cityController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictToAdmin);

router.get('/', cityController.getAllCities);
router.post('/', cityController.createCity);

router
  .route('/:id')
  .get(cityController.getCity)
  .patch(cityController.updateCity)
  .delete(cityController.deleteCity);

module.exports = router;
