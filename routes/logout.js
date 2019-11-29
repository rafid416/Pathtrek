var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  req.logOut();
  req.flash("success", "You have been logged out");
  req.session.destroy();

  res.redirect('destinations');
});
module.exports = router;