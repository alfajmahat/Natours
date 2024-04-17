
const express = require('express')

const {
    getAllUsers,
    addNewUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto
} = require('../controllers/userControllers')

const {
    signup,
    login,
    protects,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/authController')

const router = express.Router()



router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

// Protect all routes after this middleware
router.use(protects)

router.patch('/updateMyPassword', updatePassword)

router.get('/me', getMe, getUser)
router.patch('/updateMe',uploadUserPhoto,resizeUserPhoto,  updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'));

router
    .route('/')
    .get(getAllUsers)
    .post(addNewUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)
module.exports = router;