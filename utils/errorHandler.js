
const errorHandler = (res, error) => {
    console.error('Error:', error);
  
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = error.message;
    } else if (error.name === 'CastError') {
      statusCode = 404; 
      message = 'Resource not found';
    } else if (error.name === 'UnauthorizedError') {
      statusCode = 401; 
      message = 'Unauthorized access';
    }
  
    res.status(statusCode).json({ error: true, message });
  };
  
  module.exports = errorHandler;
  