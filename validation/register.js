const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  // errors begins as an empty object. If it remains empty till the end of the fn, all is well and the key isValid will resolve as true.
  let errors = {};

  // Validator checks if the length is between 2 and 30.
  // If this isn't true then a string describing the error is added to the errors object.
  // This means the errors object is no longer empty.
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters.";
  }

  // The fn returns an object with the errors object,
  // and isValid will be true or false depending on whether errors isEmpty.
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
