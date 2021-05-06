const express = require('express');
const userController = require('./controllers/userController');
const {validate, validationResult} = require('./helpers/validator');

const router = express.Router();

//User Routes
router.post('/signUp', validate('signUp'), validationResult, userController.signUp );

router.post('/login', validate('login'), validationResult, userController.login);    

router.post('/forgetPassword', validate('forgetPassword'), validationResult, userController.forgetPassword);
module.exports = router;