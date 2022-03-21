const { reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "We couldn't find the camp you are looking for...");
    return res.redirect("/campgrounds");
  } else if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    res.redirect("/campgrounds");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { idCamp, id_review } = req.params;
  const review = await Review.findById(id_review);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    res.redirect(`/campgrounds/${idCamp}`);
  }
  next();
};
