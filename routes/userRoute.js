const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(
    wrapAsync(async (req, res) => {
      try {
        const { username, email, password } = req.body;

        let newUser = new User({
          username,
          email,
        });

        let registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.flash("success", "User was registered");
        res.redirect("/listings");
      } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
      }
    })
  );

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
     async (req, res) => {
        req.flash("success","Welcome to WanderNest!! You are logged in!")
        res.redirect("/listings")
    }
  );
module.exports = router;
