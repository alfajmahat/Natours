const express = require('express');
const {
    getCheckoutSession,
    createBooking,
    getBooking,
    getAllBookings,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');
const {
    protects,
    restrictTo
} = require('../controllers/authController');

const router = express.Router();

router.use(protects);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;