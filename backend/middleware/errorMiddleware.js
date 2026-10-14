/**
 * Error Handling & Security Middlewares
 */

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

const protectAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const configuredKey = process.env.ADMIN_API_KEY || 'campus-navigator-admin-secret-2026';

  if (!adminKey || adminKey !== configuredKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing administrator key in x-admin-key header.'
    });
  }

  next();
};

module.exports = {
  notFound,
  errorHandler,
  protectAdmin
};
