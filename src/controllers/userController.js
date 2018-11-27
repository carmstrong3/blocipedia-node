const passport = require("passport");
const userQueries = require("../db/queries.users.js");
const sgMail = require('@sendgrid/mail');
const wikiQueries = require("../db/queries.wikis.js");
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_sQXp1MgTszrY4qr6aZeDGNCn");

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
           res.redirect("/wikis");
         })
       }
     });
  },
  signInForm(req, res, next){
    res.render("users/sign_in");
  },
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        console.log("before flash")
        req.flash("notice", "Sign in failed. Please try again.");
        console.log("after flash")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/wikis");
      }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  show(req, res, next){

   // call getUser, passing the id
    userQueries.getUser(req.params.id, (err, result) => {

   // If the user property of result is not defined, there is no user.
      if(err || result.user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {

   // If everything passed, render the view via the result object.
        res.render("users/show", {result});
      }
    });
  },
  checkOutView(req, res, next){
    res.render("users/upgrade");
  },
  checkOut(req, res, next){
    const token = req.body.stripeToken; // Using Express

    const charge = stripe.charges.create({
      amount: 999,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    });
  // Grab the user
    userQueries.setPremiumUser(res.locals.currentUser.id, (err, result) => {
      if(err || result.users === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/users/show")
      } else {
        res.redirect(303, "/");
      };
    });
  },
  downgrade(req, res, next){
    userQueries.setMemberUser(res.locals.currentUser.id, (err, result) => {
      if(err){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/")
      } else {
        wikiQueries.setPrivateToPublic(res.locals.currentUser.id, (err, result) => {
          if(err){
            req.flash("notice", "No user found with that ID.");
            res.redirect("/")
          } else {
           res.redirect(303, "/");
          };
        })
      }
    });
  }
}

