const express = require('express');
const tourController = require('../controllers/tourController');

const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkId);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route('/stats').get(tourController.toursStats);

tourRouter.route('/monthly-plan/:year').get(tourController.monthlyPlan);

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
