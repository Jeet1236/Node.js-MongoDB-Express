const express = require('express');
const authController = require('./../controllers/authController');
const tourController = require('../Controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const Router = express.Router();
const {
  getAllTours,
  createTour,
  getTourById,
  deleteTour,
  middleware,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
} = require('../Controllers/tourController');

// Router.param('id', checkId);
Router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

Router.route('/tour-stats').get(getTourStats);

Router.route('/monthly-plan/:year').get(
  getMonthlyPlan,
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(
  getToursWithin,
);

Router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

Router.route('/')
  .get(authController.protect, getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    middleware,
    createTour,
  );

Router.route('/:id')
  .get(getTourById)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour,
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    updateTour,
  );

Router.use('/:tourId/reviews', reviewRouter);
// Router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview,
// );
module.exports = Router;
