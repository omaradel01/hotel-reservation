const express = require('express');

const reservationController = require('../controllers/reservationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictToAdmin);

router
  .route('/')
  .get(reservationController.getAllReservations)
  .post(reservationController.createReservation);

router
  .route('/:id')
  .get(reservationController.getReservation)
  .patch(reservationController.updateReservation);

module.exports = router;
