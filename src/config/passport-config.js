//  Import Passport and the local strategy to use in the implementation
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app){

// Initialize Passport and tell it to use sessions to keep track of authenticated users.
    app.use(passport.initialize());
    app.use(passport.session());

// Passport looks for properties called username and password in the body of the request by default, so an option called usernameField is passed to specify what property to use instead
    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({
        where: { email }
      })
      .then((user) => {

// If no user with a provided email, or if the password doesn't match the one in the db, return an error message
        if (!user || !authHelper.comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }
// If everything passes, return the authenticated user
        return done(null, user);
      })
    }));

// serializeUser takes the authenticated user's ID and stores it in the session. 
    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

// deserializeUser takes the ID stored in the session and returns the user associated with it.
    passport.deserializeUser((id, callback) => {
      User.findById(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err =>{
        callback(err, user);
      }))

    });
  }
}
