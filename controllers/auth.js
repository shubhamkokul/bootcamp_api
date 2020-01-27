const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");

// @desc    Register User
// @route   Get /api/v1/auth/register
// @access  Private

exports.register = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true
  });
});
