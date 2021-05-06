const nodemailer = require('nodemailer');

  module.exports = async(data) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      try {
      return await transporter.sendMail(data);
      } catch (error) {
        throw new Error(error);
      }
  }