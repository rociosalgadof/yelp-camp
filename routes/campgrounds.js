const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

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
  isLoggedIn,
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

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("author");
    if (!foundCamp) {
      req.flash("error", "We couldn't find the camp you are looking for...");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { foundCamp });
  })
);

router.post(
  "/",
  isLoggedIn,
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
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "You have succesfully added a new camp!");
    res.redirect("/campgrounds");
  })
);

router.patch(
  "/:id",
  isLoggedIn,
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
  isLoggedIn,
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
