const express = require('express');
const bookingController = require('./../controllers/bookingController');
const Router = express.Router();
const authController = require('./../controllers/authController');

Router.use(authController.protect);
Router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

Router.use(authController.restrictTo('admin', 'lead-guide'));

Router.route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

Router.route('/:id')
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking)
  .post(bookingController.createBooking);

module.exports = Router;
