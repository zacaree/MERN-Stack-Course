const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Bring in the User model for use in our routes.
// We can use any Mongoose methods that it brings along with it because Mongoose is loaded in the User file.
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests the users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// @route   GET api/users/register
// @desc    Register the user
// @access  Public
// It'll be router.post because we're going to expect a post request
router.post("/register", (req, res) => {
  // 1. Use Mongoose to find out if the email exists because we don't want someone to sign up with an email that's already in the database.
  // findOne is a Mongoose method. It's going to look at the email address given in the form and try to findOne that matches in the DB.
  // When we send data to a route through a POST request using a form in out React app, we access that data on the Node side using req.body.<name of the form input>
  User.findOne({ email: req.body.email }).then(user => {
    // if user is truthy, that means that there is a user with that email address already in the DB
    if (user) {
      // Throw a 400 error and return a message
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // Grab an avatar based on given email address. Then there are some options...
      const avatar = gravatar.url(req.body.email, {
        s: 200, // img size
        r: "pg", // rating
        d: "mm" // default image if none is found associated with the given email address
      });
      // Otherwise create the new user
      // When creating a resource with Mongoose, use "new" and then the model name. User in this case.
      // Then you pass in the data as an object.
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Taking in password and hashing it for storage in the DB
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / returning JWT (JSON Web Token)
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find a user in the DB who's email matches what has just been stored in the email variable above. This will return a promise.
  User.findOne({ email: email }).then(user => {
    // If user is not found return. Otherwise keep going.
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password. Password user just gave is plain text but the one in the DB is hashed so we need to use bcrypt to compare the two.
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "Success!" });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
