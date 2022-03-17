const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas");
const Review = require("../models/review");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/new",
  catchAsync(async (req, res) => {
    const { idCamp } = req.params;
    const camp = await Campground.findById(idCamp);
    res.render("reviews/new", { camp });
  })
);

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res, next) => {
    if (!req.body) throw new ExpressError("Invalid Review Data", 400);
    console.log(req.body);
    const { body, rating } = req.body;
    const { idCamp } = req.params;
    const camp = await Campground.findById(idCamp);
    const review = new Review({ body, rating });
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    res.redirect(`/campgrounds/${idCamp}`);
  })
);

router.delete(
  "/:id_review",
  catchAsync(async (req, res) => {
    const ids = req.params;
    const camp = await Campground.findByIdAndUpdate(ids.idCamp, {
      $pull: { reviews: ids.id_review },
    });
    const review = await Review.findByIdAndDelete(ids.id_review);
    res.redirect(`/campgrounds/${ids.idCamp}`);
  })
);

module.exports = router;
