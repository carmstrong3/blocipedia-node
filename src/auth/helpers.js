const bcrypt = require("bcryptjs");

module.exports = {

// ensureAuthenticated can be passed as a middleware function placed before protected requests that require authentication
  ensureAuthenticated(req, res, next) {
    if (!req.user){
      req.flash("notice", "You must be signed in to do that.")
      return res.redirect("/users/sign_in");
    } else {
      next();
    }
  },

// call comparePass with the plain-text password sent in the request and the hashed password retrieved by the strategy
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}
