
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);


router.post('/login', authController.login);


router.post('/verifyotp', authController.verifyotp);

router.post('/forgetpassword',authController.forgetpassword);


router.post('/updatepassword',authController.updatepassword);

module.exports = router;
