const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');
const emailService = require('../services/emailService');
const otpGenerator = require('otp-generator');

const otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
const authController = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

     
      const newUser = await User.create({ email, password, otp });


      emailService.sendVerificationEmail(newUser.email, otp);

      res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  verifyotp:async (req, res) => {
    try{
      const{otp}=req.body;
      console.log(req.body);
      const verify=await User.findOne({otp});
      if(verify)
      {
        return res.status(200).json({message:"your otp successfully verified"});
      }

    }catch(error) {
      errorHandler(res, error);
    }
  },


  login: async (req, res) =>  {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.comparePassword(password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: 'Email not verified. Please check your email for verification instructions.' });
      }
      const token = generateToken(user);
      res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  logout: (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
  },
};

module.exports = authController;
