const express = require('express')

const {
    getAllReviews,
    addNewReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview
} = require('../controllers/reviewController')

const {
    protects,
    restrictTo
} = require('../controllers/authController')

const router = express.Router({ mergeParams: true });

router.use(protects)
router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, addNewReview)

router.route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview)

module.exports = router;