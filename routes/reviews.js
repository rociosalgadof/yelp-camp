const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas");
const Review = require("../models/review");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const controllers = require("../controllers/reviewsControllers");
const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware");

router.get("/new", isLoggedIn, catchAsync(controllers.renderReviewForm));

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(controllers.submittNewReview)
);

router.delete(
  "/:id_review",
  isReviewAuthor,
  catchAsync(controllers.deleteReview)
);

module.exports = router;
