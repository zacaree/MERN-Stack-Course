const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  // errors begins as an empty object. If it remains empty till the end of the fn, all is well and the key isValid will resolve as true.
  let errors = {};

  // Validator only takes in strings so our custom isEmpty fn checks for undefined and null in case the user left the field blank.
  // Then this will take that undefined or null and set them to an empty string.
  // Once its set to an empty string it can be checked by Validator.
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Validator checks if the length is between 2 and 30.
  // If this isn't true then a string describing the error is added to the errors object.
  // This means the errors object is no longer empty.
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be at least 2 characters and no more than 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  // The fn returns an object with the errors object,
  // and isValid will be true or false depending on whether errors isEmpty.
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
