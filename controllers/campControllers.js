const campground = require("../models/campground");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const cloudinary = require("cloudinary").v2;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {
    campgrounds,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "We couldn't find the camp you are looking for...");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.renderCampDetails = async (req, res) => {
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
};

module.exports.addNewCamp = async (req, res, next) => {
  if (!req.body) throw new ExpressError("Invalid Campground Data", 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  const { title, location, description, price, image } = req.body;
  const camp = await new Campground({
    title,
    location,
    description,
    price,
    image,
  });
  camp.author = req.user._id;
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.geometry = geoData.body.features[0].geometry;
  await camp.save();
  req.flash("success", "You have succesfully added a new camp!");
  res.redirect("/campgrounds");
};

module.exports.editCamp = async (req, res) => {
  const { id } = req.params;
  const newCamp = req.body;
  let foundCamp = await Campground.findByIdAndUpdate(id, newCamp, {
    runValidators: true,
    new: true,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  foundCamp.images.push(...imgs);
  await foundCamp.save();
  const { deleteImages } = req.body;
  if (deleteImages !== undefined) {
    for (let filename of deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }
  if (!foundCamp) {
    req.flash("error", "We couldn't find the camp you are looking for...");
    return res.redirect("/campgrounds");
  }
  req.flash("success", "Edited!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  if (!deletedCamp) {
    req.flash("error", "We couldn't find the camp you are looking for...");
    return res.redirect("/campgrounds");
  }
  req.flash("success", `You have succesfully deleted ${deletedCamp.title}!`);
  res.redirect("/campgrounds");
};
