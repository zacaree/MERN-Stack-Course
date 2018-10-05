const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body Parser middleware
// This allows us to use req.body.<whatever> in our project
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config - Pull in credentials for connecting to DB
const db = require("./config/keys").mongoURI;

// Connect to MongoDB through Mongoose
// including the useNewUrlParser silenced a deprication error I was getting
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// The first option is for use in production the second option is for use during development
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
