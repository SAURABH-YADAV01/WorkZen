const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    message: isProduction ? "Server error" : err.message
  });
};

module.exports = errorHandler;
