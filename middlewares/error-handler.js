module.exports = (err, req, res, next) => {
  console.error(err.stack || err.message || err);

  // Determine the status code
  const statusCode = err.statusCode || 500;

  // Send a response with the status code and error message
  res.status(statusCode).send({
    // If we know the error, send the error message; otherwise, a generic message
    message: statusCode === 500 ? 'An internal server error occurred' : err.message,
  });
};