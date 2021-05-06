const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const sendEmail = require('../helpers/email');


const hashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const validatePassword =  async(password, user) =>{
    return await bcrypt.compare(password, user.password);
}

const createAccessToken = async(payload) => {
    return await jwt.sign(payload, process.env.JWT_SECRET ,{ expiresIn: '1h' } )
}

const createResetPasswordCode = (email) => {
    return crypto.randomBytes(16).toString('hex'); 
}

exports.signUp = async(req, res, next) => {
    const {firstName, lastName, phoneNumber, email, gender, password, photo } = req.body;

    const newUser = new userModel({firstName, lastName, phoneNumber, email, gender, password, photo });

    newUser.password = await hashPassword(password);
    await newUser.save();
    res.status(200).json({
        message:'User sign up successfully',
        user:newUser
    })
}

exports.login = async(req, res, next) => {
    const {email, password} = req.body;

    const userFound = await userModel.findOne({email});
    if(!userFound){
      res.status(400).json({message:'User not registered'});
      return;
    }
    const checkPassword = await validatePassword(password, userFound);
    if(!checkPassword) {
        res.status(400).json({message:'Authentication failure'});
        return;
    }

    const {_id, firstName, lastName, phoneNumber, gender} = userFound;
    const token = await createAccessToken(
        {_id,
        firstName,
        lastName,
        phoneNumber,
        email:userFound.email,
        gender});

    res.status(200).json({
        message:'User Login Successfully',
        token:token
    })
};

exports.forgetPassword = async(req, res, next)=> {
    const {email} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        res.status(400).json({message:'There is no user with email address.'});
        return;
    }
    
    //Create resetPasswordCode and save it to the user
    const code = createResetPasswordCode(email)
    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; //one hour
    await user.save();

    //send email to the user 
    const data ={
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link,or paste this into your browser to complete the process:
        http://'${req.headers.host}/resetPassword/${code}
        If you did not request this, please ignore this email and your password will remain unchanged.`
      };
     //await sendEmail(data);
    res.json({message:'Reset link has sent successfully'});
}
