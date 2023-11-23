const express = require('express');

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
} = require('../Controllers/tourController');

// Router.param('id', checkId);
Router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

Router.route('/tour-stats').get(getTourStats);

Router.route('/monthly-plan/:year').get(getMonthlyPlan);

Router.route('/').get(getAllTours).post(middleware, createTour);

Router.route('/:id').get(getTourById).delete(deleteTour).patch(updateTour);

module.exports = Router;
