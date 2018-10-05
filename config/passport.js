const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// this comes from the export in our User model.
const User = mongoose.model("users");
const keys = require("./keys");

// Setting some options for our JWT strategy below
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// This fn checks the jwt that was given to the user after they successfully logged into the site.
// After logging in, the user now has this token that will let them into protected/private routes.
// This function below runs everytime they try to access a private route and checks their token to be sure it's valid before letting them in.
// This fn is like the bouncer at the door.
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // findById is a Mongoose method. jwt_payload is an object that has the user id in it. This'll give us a promise.
      User.findById(jwt_payload.id)
        .then(user => {
          // this runs if user was found and will return the user
          if (user) {
            return done(null, user);
          }
          // this runs if user wasn't found
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
