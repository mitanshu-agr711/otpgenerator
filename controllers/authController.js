const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');
const emailService = require('../services/emailService');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secretKey = 'Mitanshu';
const bcrypt = require('bcrypt');
const tempStorage = new Map();
const authController = {
register: async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

    
    const hashedPassword = await bcrypt.hash(password, 10);

 
    tempStorage.set(email, { hashedPassword, otp, createdAt: Date.now() });

  
    emailService.sendVerificationEmail(email, otp);

    res.status(201).json({
      message: 'OTP sent to your email. Please verify to complete registration.'
    });
  } catch (error) {
    errorHandler(res, error);
  }
},

verifyotp: async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

   
    const tempData = tempStorage.get(email);

    if (!tempData) {
      return res.status(400).json({ message: 'No registration data found. Please register again.' });
    }

    const { hashedPassword, otp: storedOtp, createdAt } = tempData;

 
    if (storedOtp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

   
    const otpExpiry = 10 * 60 * 1000; 
    if (Date.now() - createdAt > otpExpiry) {
      tempStorage.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

  
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: true
    });

  
    tempStorage.delete(email);

    res.status(200).json({ message: 'OTP verified successfully. Registration complete.' });
  } catch (error) {
    errorHandler(res, error);
  }
},

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(user.isVerified);
    if (!user.isVerified) {
      return res.status(401).json({ message: 'User not verified. Please check your email for verification instructions.' });
    }

 
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      
      const passwordMatch = await bcrypt.compare(password, user.password);
      // console.log(passwordMatch);
      // If passwords match
      if (passwordMatch) {
        // Generate JWT for authentication
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "20 days",
        });

        return res
          .status(200)
          .json({ token, id: user._id, username: user.username });
      } else {
        // If passwords don't match
        return res.status(401).json({ message: "Invalid credentials." });
      }
    } catch (error) {
      errorHandler(res, error);
    }
  },
  forgetpassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const resetToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '10m' });
      const link = `http://localhost:3000/updatepassword/${resetToken}`;
      // Send an email with a link containing the reset token
      emailService.sendPasswordResetEmail(email, link);
      // emailService.sendPasswordResetEmail(email);

      res.status(201).json({ message: `Check your email for forget password and click on given link for reset ${resetToken}` });
    }
    catch (error) {
      errorHandler(res, error);
    }
  },
  updatepassword: async (req, res) => {
    try {
      const { resetToken, newpassword } = req.body;

      if (!resetToken || !newpassword) {
        return res.status(400).json({ message: 'Token and password are required' });
      }

      // Find the user in the database using the decoded user ID
      const decoded = jwt.verify(resetToken, secretKey);

      const user = await User.findById(decoded.userId);
      console.log(user)

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      // Invalidate old password
      user.password = newpassword;

      // Optional: Force password change on next login
      user.forcePasswordChange = true;

      await user.save();
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      errorHandler(res, error);
    }
  }
};

module.exports = authController;














// $2b$10$T8KPmQAS00sF0u//wxVPS.VZap43gSbwbkSZ0sIoINLY0PGdqepkW"