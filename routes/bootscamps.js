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

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(photoUploadBootCamp);

router
  .route("/")
  .get(advanceResults(Bootcamp, 'courses'), getBootCamps)
  .post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
