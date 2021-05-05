const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'Please tell us your first name!']
    },
    lastName:{
        type:String,
        required:[true, 'Please tell us your last name!']
    },
    phoneNumber:{
        type:String,
        required:[true, 'Please tell us your phone number!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim:true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    gender:{
        type:String,
        enum:['male', 'female']
    },
    photo:{
        type:String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
      },
})

const userModel = mongoose.model('Users', userSchema)

module.exports = userModel;