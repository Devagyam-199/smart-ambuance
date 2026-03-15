import apiError from "./apiError.utils.js";
const globalError = (err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error from global error handler",
  });
};

export default globalError;
