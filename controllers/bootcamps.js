const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require("path");

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// @desc    Get single bootcamps
// @route   Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");
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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found for ID of ${req.params.id}`),
      404
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get bootcamps within a radius
// @route   Delete /api/v1/bootcamps/radius/:zipcode/:distance/
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //Get Lat, Long Geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  // Cal Radius using radians
  // Divide distance by radius of Earth
  // Earth Eadius = 3,963 mi /6,378.1 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[long, lat], radius]
      }
    }
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc    Upload photo for Bootcamp
// @route   Put /api/v1/bootcamps/:id/photo
// @access  Private
exports.photoUploadBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found for ID of ${req.params.id}`),
      404
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  //Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }
  //Check filezise
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  //Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 400));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name
    });
  });

  res.status(200).json({
    success: true,
    data: file.name
  });
});
