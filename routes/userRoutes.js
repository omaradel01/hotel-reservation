const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/logout', authController.logout);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.updateCurrentUser);

router.post('/makeReservation', reservationController.makeReservation);
router.get('/myReservations', reservationController.getCurrentUserReservations);

router.use(authController.restrictToAdmin);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
