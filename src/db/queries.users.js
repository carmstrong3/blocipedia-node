// Require the user model and bcrypt library
const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Wiki = require("./models").Wiki;

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
  },

  getUser(id, callback){
 // Define a result object to hold the user and wikis that will be returned and requested the User object from the database.
    let result = {};
    User.findById(id)
    .then((user) => {
 // If no user returns, we return an error.
      if(!user) {
        callback(404);
      } else {
 // If the user is there, we return the user
        result["user"] = user;
 // Execute the scope on Post to get hte last five posts made by the user
        Wiki.scope({method: ["lastFiveFor", id]}).all() .then((wikis) => {
 // Store the result in the result object
          result["wikis"] = wikis;
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      }
    });
  },

  setPremiumUser(id, callback){
    let premium = {role: "premium"};
    return User.findByPk(id)
    .then((user) => {
      if(!user){
        return callback("User not found");
      }
      user.update(premium, {
        fields: Object.keys(premium)
      })
      .then(() => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },

  setMemberUser(id, callback){
    let member = {role: "member"};
    return User.findByPk(id)
    .then((user) => {
      if(!user){
        return callback("User not found");
      }
      user.update(member, {
        fields: Object.keys(member)
      })
      .then(() => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }

}
