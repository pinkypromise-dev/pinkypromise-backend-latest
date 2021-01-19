const express = require('express');
const router = express.Router();
const userController = require('./controller/usercontroller');
const middleware = require('../middlewares/authMiddleware');
const { format } = require('path');
router.post('/signup', userController.signup)
router.post('/updatedefaultlanguage', userController.updatedefaultlanguage)
router.post('/verifyphone', userController.verifyphone)
router.post('/resendotp', userController.resendotp)
router.post('/verifyotp', userController.verifyotp)
router.post('/login', userController.login)
router.post('/forgetpassword', userController.forgetpassword)

router.post('/createaccount', middleware.auth, userController.createaccount)
router.post('/getprofile', middleware.auth, userController.getprofile)
router.post('/addAddress', middleware.auth, userController.addAddress)
router.post('/getlanguage', middleware.auth, userController.getlanguage)
router.post('/changepassword', middleware.auth, userController.changepassword)
router.get('/termsandcondition', userController.getprivacypolicy)
router.post('/removeuser', userController.removeuser)
module.exports = router;