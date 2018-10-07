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

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};
  // We want to get data from input fields. This will be in req.body.
  const profileFields = {};
  // The user will come in through JWT
  profileFields.user = req.user.id;
  // Has the handle been sent in from the form? If so, add it to the profileFields object.
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // Skills - Split into an array.
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }
  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then(profile => {
    // Edit user profile
    // If profile exists, then we want to edit the profile on this route. Otherwise we want to create the user.
    if (profile) {
      // Edit user profile
      // Find user by user id. Then edit that user with data from the profileFields object we created.
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
      // Create user profile
      // If profile doesn't exist, create it.
    } else {
      // Create user profile
      // First check if the user's chosen handle already exists
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = "That handle already exists.";
          res.status(400).json(errors);
        }

        // Save profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

module.exports = router;
