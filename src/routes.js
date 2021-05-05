const express = require('express');
const userController = require('./controllers/userController');
const {validate, validationResult} = require('./helpers/validator');

const router = express.Router();

//User Routes
router.post(
    '/signUp',
    validate('signUp'),
    validationResult,
    userController.signUp )

module.exports = router;