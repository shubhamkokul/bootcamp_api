const express = require("express");
const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  photoUploadBootCamp
} = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamp");
const advanceResults = require("../middleware/advanceResult");

//Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

//Protect route middleware
const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(protect, authorize('publisher', 'admin'), photoUploadBootCamp);

router
  .route("/")
  .get(advanceResults(Bootcamp, 'courses'), getBootCamps)
  .post(protect, authorize('publisher', 'admin'), createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootCamp);

module.exports = router;
