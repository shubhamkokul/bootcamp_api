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
exports.createBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create New bootcamp" });
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
