const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const controllers = require("../controllers/campControllers");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(catchAsync(controllers.index))
  .post(isLoggedIn, validateCampground, catchAsync(controllers.addNewCamp));

router.get("/new", isLoggedIn, controllers.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(controllers.renderCampDetails))
  .patch(isLoggedIn, validateCampground, catchAsync(controllers.editCamp))
  .delete(isLoggedIn, catchAsync(controllers.deleteCamp));

router.get("/edit/:id", isLoggedIn, catchAsync(controllers.renderEditForm));

module.exports = router;
