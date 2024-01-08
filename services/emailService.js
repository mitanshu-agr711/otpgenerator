// const emailjs = require('@emailjs/nodejs');
const otpGenerator = require('otp-generator');

const nodemailer = require('nodemailer');

const emailService = {
  sendVerificationEmail: async (email, otp) => {
    console.log('Sending verification email..');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'mitanshuagrawal5@gmail.com',
        pass: 'bmvgvzycgbdbkerj'
      }
    });
    
    console.log(email, otp);

    const mailOptions = {
      from: 'mitanshuagrawal5@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Hello, please verify your email to complete the registration process.</p><p>Your OTP is: ${otp}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', mailOptions);
        console.log('Verification email sent:', info.response);
      }
    });
  }
} 

module.exports = emailService;