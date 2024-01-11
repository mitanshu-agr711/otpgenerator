const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');
const emailService = require('../services/emailService');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secretKey = 'Mitanshu'; 
const secretsKey = 'mynameis'; 



const authController = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

     
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

     
      const newUser = await User.create({ email, password, otp });

     
      emailService.sendVerificationEmail(newUser.email, otp);

      res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  verifyotp: async (req, res) => {
    try {
      const { otp, email } = req.body;

      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.otp === otp) {
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: "Your OTP is successfully verified" });
      } else {
        return res.status(401).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      errorHandler(res, error);
    }
  },
 
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.comparePassword(password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: 'Email not verified. Please check your email for verification instructions.' });
      }

      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      console.log(`this is token ${token}`);
      res.status(201).json({ message: 'User login successfully', token });;
    } catch (error) {
      errorHandler(res, error);
    }
  },
  forgetpassword:async(req,res)=>{
    try{
      const{email}=req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const resetToken = jwt.sign({ userId: user._id }, secretsKey, { expiresIn: '10m' });
      user.resetToken = resetToken;  // <-- Keep it as resetToken
      await user.save();
      const link=`http://localhost:3000/updatepassword/${resetToken}`;
    // Send an email with a link containing the reset token
    emailService.sendPasswordResetEmail(email,link);
    // emailService.sendPasswordResetEmail(email);
     
      res.status(201).json({ message: `Check your email for forget password and click on given link for rest ${resetToken}` });
    }
    catch(error){
      errorHandler(res, error);
    }
   },
  updatepassword:async(req,res)=>{
    try{
      const{token,newpassword}=req.body;
     if(!token || !newpassword)
     {
       return res.send(400).json({message:'token and password is required'});
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, secretsKey);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find the user in the database using the decoded user ID
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    user.password = newpassword; 
     user.resetToken=undefined;
     await user.save();
     res.status(200).json({ message: 'Password reset successful' });


  }
    catch(error){
      errorHandler(res, error);
    }
  }

};

module.exports = authController;
