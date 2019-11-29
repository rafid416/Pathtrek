var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
  ssn=req.session;
  res.render('login');
  ///{error: ssn.error}
});


router.post('/', passport.authenticate("local", {successRedirect: "profile", failureRedirect: "login" }),
      function(req, res) {
        req.flash("success", "Welcome to your profile " + req.user);
      });


  function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    req.flash("error", "Please login to use the features of this site");
    res.redirect('/login');
  }

module.exports = router;