const { body, validationResult } = require('express-validator');
const userModel = require('../models/userModel');

module.exports = {
    validate: (method) => {
        switch (method) {
          case 'signUp': {
           return [ 
              body('firstName', 'Please tell us your first name!').exists(),
              body('lastName', 'Please tell us your last name!').exists(),
              body('phoneNumber', 'Please tell us your phone number!').exists(),
              body('email')
              .not()
              .isEmpty()
              .withMessage('email is required')
              .trim()
              .isEmail()
              .withMessage('email is invalid')
              .custom(async (email)=>{
                  const userFound = await userModel.findOne({email});
                  if(userFound){
                    throw new Error('Email already in use!');
                  }
              }),
               body('password')
              .not()
              .isEmpty()
              .withMessage('password is required')
              .isLength({ min: 8 })
              .withMessage('password must be at least 6 numbers'),
              body('gender').exists().isIn(['male', 'female']),
              body('photo').optional()
             ]   
          }
          case 'login' : {
            return [
              body('email')
              .not()
              .isEmpty()
              .withMessage('email is required')
              .trim()
              .isEmail()
              .withMessage('email is invalid'),
               body('password')
              .not()
              .isEmpty()
              .withMessage('password is required')
              .isLength({ min: 8 })
              .withMessage('password must be at least 6 numbers'),
            ]

          }
          case 'forgetPassword' : {
            return [
              body('email')
              .not()
              .isEmpty()
              .withMessage('email is required')
              .trim()
              .isEmail()
              .withMessage('email is invalid'),
            ]
          }
        }
      },
      validationResult: (req, res, next)=> {
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
      }
}