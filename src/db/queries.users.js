// Require the user model and bcrypt library
const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
// createUser takes an object with email, password, and passwordConfirmation properties, and a callback
  createUser(newUser, callback){

// bcrypt generates a salt and passes that to the hashSync hashing function with the password to hash
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// Store the hashed password in the db when the user object is created and return the user.
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  }

}
