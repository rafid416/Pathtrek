var express = require('express');
var router = express.Router();
var User = require('./user');
var Destination = require('./destination');

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  console.log(req.user)
  res.redirect('login');
}

router.get('/', isLoggedIn, function(req, res, next) {
  User.findById(req.user.id, function(err, foundUser){

    if(err) {
      req.flash("error", "something went wrong");
      return res.redirect('destinations');
    }
    
    Destination.find().where('author.id').equals(foundUser._id).exec(function(err, destinations) {
      if(err) {
        req.flash("error", "something went wrong");
        return res.redirect('destinations')
      }

    res.render('profile', {user: foundUser, destinations: destinations});
  });
  });

});


router.post('/emailupdate', function(req, res, next) {
  User.findById(req.user.id, function(err, foundUser){
    foundUser.email = req.body.newemail
    console.log(req.user);
    console.log(req.body.newuname)
    foundUser.save();
    res.redirect('/profile');

  });
});

module.exports = router;