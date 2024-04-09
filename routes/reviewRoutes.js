const express = require('express');

const Router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
  // eslint-disable-next-line import/extensions
} = require('../Controllers/reviewController');

Router.use(authController.protect);

Router.route('/')
  .get(getAllReviews)
  .post(
    authController.restrictTo('user'),
    setTourUserIds,
    reviewController.checkBooking,
    createReview
  );

Router.route('/:id')
  .delete(authController.restrictTo('user', 'admin'), deleteReview)
  .patch(authController.restrictTo('user', 'admin'), updateReview)
  .get(getReview);

module.exports = Router;
