const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// Load profile and user models so we can use them in Mongoose
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Tests the profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile works!" }));

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};
  // When the token is created it puts the user into req.user so we have access to it.
  // So we want to findOne user in the DB whose id matches rew.user.id stored in the JWT.
  // This will be the user profile we display on this route.
  // This will return a promise as it looks at the DB.
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
