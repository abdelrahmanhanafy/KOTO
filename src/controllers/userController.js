const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.signUp = async(req, res, next) => {
    const {firstName, lastName, phoneNumber, email, gender, password, photo } = req.body;

    const newUser = new userModel({firstName, lastName, phoneNumber, email, gender, password, photo });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    res.send(newUser);

}