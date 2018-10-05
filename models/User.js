const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Set module.exports to a variable, User
// then set mongoose.model, passing in the name we want to use which is users
// then the second parameter is the actual schema (above)
module.exports = User = mongoose.model("users", UserSchema);
