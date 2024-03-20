const express = require('express');

const viewsController = require('../Controllers/viewsController');
// eslint-disable-next-line import/no-unresolved
const authController = require('../Controllers/authController');
const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

//Login route

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginPage);
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
