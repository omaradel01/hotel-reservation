const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/login', viewController.getLogin);
router.get('/register', viewController.getSignup);
router.get('/home', authController.protect, viewController.getHome);
router.get('/search', authController.protect, viewController.search);
router.get('/me', authController.protect, viewController.getMe);
router.get('/hotel/:id', authController.protect, viewController.showHotel);

module.exports = router;
