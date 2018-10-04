const express = require("express");
const router = express.Router();

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
      // Otherwise create the new user
      // When creating a resource with Mongoose, use "new" and then the model name. User in this case.
      // Then you pass in the data as an object.
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
    }
  });
  res.json({ msg: "reg works!" });
});

module.exports = router;
