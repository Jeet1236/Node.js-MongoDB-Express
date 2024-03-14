const express = require('express');

const viewsController = require('../Controllers/viewsController');
// eslint-disable-next-line import/no-unresolved
const authController = require('../Controllers/authController');
const router = express.Router();

router.use(authController.isLoggedIn);
router.get('/', authController.isLoggedIn, viewsController.getOverview);

//Login route

router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginPage);
module.exports = router;
