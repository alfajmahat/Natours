const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    // const message = 'Invalid ID'
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}
// match does not work
const handleDublicateFieldsDB = err => {
    // const value = err.message.match(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/)
    // console.log(value)
    // const message = `Duplicate field Name. Please use another value!`
    // search in keyValue to get the field
    const value = err.keyValue[Object.keys(err.keyValue)[0]];
    const message = `Duplicate field value: "${value}". Please use an other value.`;
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401)

const handleJWTExpiredError = () => new AppError('Your tpken has expired. Please log in again', 401)

// if env is development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

// if env is production
const sendErrorProd = (err, res) => {
    //Operational, trusted error : send message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        //1) Log Error
        console.error('ERROR', err)

        //2) Send generic message
        //Programming  and other unknown error: don't leak error details
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong..!'
        })
    }
}

//GLOBAL_ERROR_HANDLER
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        // let error = { ...err }; //Destructuring the the "err"
        if (err.name === "CastError") err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDublicateFieldsDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError()
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()

        sendErrorProd(err, res);


    }

}