const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// Load profile and user models so we can use them in Mongoose
const Profile = require("../../models/Profile");
const User = require("../../models/User");
// Load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route   GET api/profile/test
// @desc    Tests the profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile works!" }));

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  // When the token is created it puts the user into req.user so we have access to it.
  // So we want to findOne user in the DB whose id matches rew.user.id stored in the JWT.
  // This will be the user profile we display on this route.
  // This will return a promise as it looks at the DB.
  Profile.findOne({ user: req.user.id })
    // Since we connected our user to the profile inside the profile model,
    // we are able to populate fields from "ref: users" into the response.
    // So we tell it we want to populate from user and we want the name and the avatar.
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get and list all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No profiles found";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "No profiles found" }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  // Find and request a profile with a handle that matches the one in the URL
  Profile.findOne({ handle: req.params.handle })
    // Grab the name and avatar from the user model which is shared with the profile model.
    .populate("user", ["name", "avatar"])
    // Then return the user's profile
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: "There is no profile for this user" }));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  // Find and request a profile with a handle that matches the one in the URL
  Profile.findOne({ user: req.params.user_id })
    // Grab the name and avatar from the user model which is shared with the profile model.
    .populate("user", ["name", "avatar"])
    // Then return the user's profile
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
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

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
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(
        profile => res.json(profile)
      );
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

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post("/experience", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add entered experience to the experience array
    // We could use .push but this would add it to the end of the array.
    // We want to use .unshift
    profile.experience.unshift(newExp);
    // Save changes to DB
    profile.save().then(profile => res.json(profile));
  });
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post("/education", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    profile.education.unshift(newEdu);
    profile.save().then(profile => res.json(profile));
  });
});

module.exports = router;
