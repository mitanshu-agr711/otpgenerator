

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return errorHandler(res, { name: 'UnauthorizedError', message: 'Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, 'mits');


    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return errorHandler(res, { name: 'UnauthorizedError', message: 'Unauthorized access' });
    }

    next(); 
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = authMiddleware;
