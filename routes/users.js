const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const isLoggedIn = require("../middleware");
const controllers = require("../controllers/usersControllers");

router
  .route("/register")
  .get(controllers.renderRegisterForm)
  .post(catchAsync(controllers.register));

router
  .route("/login")
  .get(controllers.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    controllers.login
  );

router.get("/logout", controllers.logout);

module.exports = router;
