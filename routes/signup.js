var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrtegy = require('passport-local');
var User = require('./user');

router.get('/', function(req, res, next) {
  res.render('signup');
});


router.post('/', function(req, res, next) {
  ssn=req.session;
  var newUser = new User({username: req.body.username, email: req.body.email});
  User.register(newUser,req.body.password, function(err, user) {

    if (err) {
      // req.flash("error", "user already exists");
      console.log(err);
      return res.render('signup', {error:err.message})
    }
    console.log(req.flash)
    passport.authenticate("local")(req, res, function() {

      req.flash("Success", "Welcome to PathTrek " + req.user.username );
      res.redirect('profile')
    });
  });
});

 
module.exports = router;