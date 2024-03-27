const errorMiddleware = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // If it's a validation error (e.g., from mongoose), handle it accordingly
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message: message,
    },
  });
};

module.exports = errorMiddleware;
