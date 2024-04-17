const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


const getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId)

    const transformedItems = [{
        quantity: 1,
        price_data: {
            currency: "INR",
            unit_amount: tour.price * 100,
            product_data: {
                name: `${tour.name} Tour`,
                description: tour.description, //description here
                images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`], //only accepts live images (images hosted on the internet),
            },
        },
    }]

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        //user will be redirected to this url when payment is successful. home page
        // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${req.params.tourId
        //     }&user=${req.user.id}&price=${tour.price}`,
           success_url: `${req.protocol}://${req.get('host')}/`,
        //    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        //user will be redirected to this url when payment has an issue. tour page (previous page)
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        // we pass the tour id with "Book Tour" button
        client_reference_id: req.params.tourId,
        line_items: transformedItems,
        mode: 'payment',

    })

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    })
})

const createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    // res.redirect(req.originalUrl.split('?')[0]);
});

const createBooking = factory.createOne(Booking);
const getBooking = factory.getOne(Booking);
const getAllBookings = factory.getAll(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);

module.exports = {
    getCheckoutSession,
    createBookingCheckout,
    createBooking,
    getBooking,
    getAllBookings,
    updateBooking,
    deleteBooking
}