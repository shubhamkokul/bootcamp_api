const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @access  Public
exports.getBootCamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all Bootcamps" });
};

// @desc    Get single bootcamps
// @route   Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// @desc    Create new Bootcamp
// @route   Post /api/v1/bootcamps
// @access  Private
exports.createBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};

// @desc    Update Bootcamp
// @route   Put /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Update bootcamp" });
};

// @desc    Delete Bootcamp
// @route   Delete /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Delete bootcamp" });
};
