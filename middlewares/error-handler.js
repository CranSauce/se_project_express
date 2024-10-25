module.exports = (err, req, res, next) => {
  console.error(err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An internal server error occurred" : err.message,
  });
};
