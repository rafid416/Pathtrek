var express = require('express');
var router = express.Router();
var User = require('./user');


router.post('/', function(req, res, next) {
    User.findById(req.user.id, function(err, foundUser){
        foundUser.username = req.body.newuname
        console.log(req.user);
        console.log(req.body.newuname)
        foundUser.save();
        res.redirect('profile');


        });
  });
  module.exports = router;