const express = require('express')
const {
    getAllTours,
    addNewTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages
} = require('../controllers/tourControllers')

const {
    protects,
    restrictTo
} = require('../controllers/authController')

const reviewRouter = require('./reviewRoutes')
const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

/* router
    .route('/:tourId/reviews')
    .post(protects, restrictTo('user'), addNewReview) */

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)
router
    .route('/tour-stats')
    .get(getTourStats)
router
    .route('/monthly-plan/:year')
    .get(protects, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
    .route('/')
    .get(getAllTours)
    .post(protects, restrictTo('admin', 'lead-guide'), addNewTour)

router
    .route('/:id')
    .get(getTour)
    .patch(protects, restrictTo('admin', 'lead-guide'), uploadTourImages,resizeTourImages, updateTour)
    .delete(protects, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router;