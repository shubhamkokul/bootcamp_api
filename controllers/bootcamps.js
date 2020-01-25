const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc    Get single bootcamps
// @route   Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found for ID of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    });
});

// @desc    Create new Bootcamp
// @route   Post /api/v1/bootcamps
// @access  Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
});

// @desc    Update Bootcamp
// @route   Put /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found for ID of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    });
});

// @desc    Delete Bootcamp
// @route   Delete /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = Bootcamp.findByIdAndDelete(res.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found for ID of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    });
});
