const express = require("express");
const mongoose = require("mongoose");

// DB Config - Pull in credentials for connecting to DB
const db = require("./config/keys").mongoURI;

// Connect to MongoDB through Mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

const app = express();
// The home route
app.get("/", (req, res) => res.send("Yo bro!"));
// The first option is for use in production the second option is for use during development
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
