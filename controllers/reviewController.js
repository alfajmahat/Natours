const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


const setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

const getAllReviews = factory.getAll(Review)
const getReview = factory.getOne(Review)
const addNewReview = factory.createOne(Review)
const updateReview = factory.updateOne(Review)
const deleteReview = factory.deleteOne(Review)

module.exports = {
    getAllReviews,
    addNewReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview
}