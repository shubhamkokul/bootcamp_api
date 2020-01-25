const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (error, req, res, next) => {
  let localError = { ...error };
  localError.message = error.message;
  console.log(error.stack.red);
  //Mongoose Bad Object ID
  if (error.name === "CastError") {
    const message = `Resouce not found for ID of ${error.value}`;
    localError = new ErrorResponse(message, 404);
  }
  //Mongoose Duplicate key
  if (error.code === 11000) {
    const message = "Duplicate field value entered";
    localError = new ErrorResponse(message, 400);
  }
  //Mongoose Validation Error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map(value => value.message);
    localError = new ErrorResponse(message, 400);
  }
  res.status(localError.statusCode || 500).json({
    success: false,
    error: localError.message || "Server Error"
  });
};
module.exports = errorHandler;
