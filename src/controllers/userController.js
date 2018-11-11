const passport = require("passport");
const userQueries = require("../db/queries.users.js");
const sgMail = require('@sendgrid/mail');

module.exports = {
  signUpForm(req, res, next){
    res.render("users/signup");
  },
  create(req, res, next){
// Pull the values from the request's body and add them to a newUser object.
     let email = req.body.email;
 
     let newUser = {
       email: req.body.email,
       password: req.body.password,
       passwordConfirmation: req.body.passwordConfirmation
     };
// Call the createUser function, passing in newUser and a callback
     userQueries.createUser(newUser, (err, user) => {
       if(err){
         req.flash("error", err);
         res.redirect("/users/signup");
       } else {

// If user is created successfully, authenticate the user by calling the authenticate method on the Passport object. Specify the strategy to use (local) and pass a function to call for an authenticated user. That function sets a message and redirects to the landing page. authenticate uses the function in passport-config.js where the local strategy was defined.
     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
     const msg = {
       to: email,
       from: 'test@example.com',
       subject: 'Sending with SendGrid is Fun',
       text: 'and easy to do anywhere, even with Node.js',
       html: '<strong>and easy to do anywhere, even with Node.js</strong>',
     };
     sgMail.send(msg);


         passport.authenticate("local")(req, res, () => {
           req.flash("notice", "You've successfully signed in!");
           res.redirect("/");
         })
       }
     });
  }
}

