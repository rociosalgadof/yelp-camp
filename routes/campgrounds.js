const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {
      campgrounds,
    });
  })
);

router.get(
  "/edit/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash("error", "We couldn't find the camp you are looking for...");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate("reviews");
    if (!foundCamp) {
      req.flash("error", "We couldn't find the camp you are looking for...");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { foundCamp });
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    if (!req.body) throw new ExpressError("Invalid Campground Data", 400);
    const { title, location, description, price, image } = req.body;
    const camp = await new Campground({
      title,
      location,
      description,
      price,
      image,
    });
    await camp.save();
    req.flash("success", "You have succesfully added a new camp!");
    res.redirect("/campgrounds");
  })
);

router.patch(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCamp = req.body;
    let foundCamp = await Campground.findByIdAndUpdate(id, newCamp, {
      runValidators: true,
      new: true,
    });
    if (!foundCamp) {
      req.flash("error", "We couldn't find the camp you are looking for...");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "Edited!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    if (!deletedCamp) {
      req.flash("error", "We couldn't find the camp you are looking for...");
      return res.redirect("/campgrounds");
    }
    req.flash("success", `You have succesfully deleted ${deletedCamp.title}!`);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
