const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Set CORS headers on error responses
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);

  // Handle specific error types
  switch (true) {
    case err.message === 'CORS not allowed':
      return res.status(403).json({
        success: false,
        error: 'CORS Error',
        message: 'This origin is not allowed to access the resource'
      });

    case err.name === 'ValidationError':
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: Object.values(err.errors).map(val => val.message).join(', ')
      });

    case err.name === 'MongoError' && err.code === 11000:
      return res.status(400).json({
        success: false,
        error: 'Duplicate Error',
        message: 'A record with this information already exists'
      });

    case err.name === 'JsonWebTokenError':
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Invalid token. Please log in again.'
      });

    case err.name === 'TokenExpiredError':
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Token expired. Please log in again.'
      });

    default:
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      return res.status(statusCode).json({
        success: false,
        error: err.name || 'Error',
        message: err.message || 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
      });
  }
};

module.exports = errorHandler;
