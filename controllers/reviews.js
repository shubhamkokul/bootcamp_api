const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");
const asyncHandler = require("../middleware/async");

// @desc    Get all Reviews
// @route   Get /api/v1/reviews
// @route   Get /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId
    });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advanceResults);
  }
});

// @desc    Get single Reviews
// @route   Get /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });
  if (!review) {
    return next(new ErrorResponse(`Invalid review id ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    create single Reviews
// @route   POST /api/v1/bootcamps/:bootcampId/reviews/
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp found with the ID ${req.params.bootcampId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    update single Reviews
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Reivew found with the ID ${req.params.id}`, 404)
    );
  }
  //Make sure review belongs to user or user id an admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`No Reivew found with the ID ${req.params.id}`, 404)
    );
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
  })
  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete single Reviews
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(
        new ErrorResponse(`No Reivew found with the ID ${req.params.id}`, 404)
      );
    }
    //Make sure review belongs to user or user id an admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(`No Reivew found with the ID ${req.params.id}`, 404)
      );
    }
    await review.remove();
    res.status(200).json({
      success: true,
      data: {}
    });
  });
