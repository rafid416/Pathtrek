require('dotenv').config();
var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');
var Comment = require('./comment')
var NodeGeocoder = require('node-geocoder');
var Destination = require('./destination');
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'rafidswebsite', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:  process.env.CLOUDINARY_API_SECRET
});

 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

var app = express();
app.use(express.urlencoded({ extended: true }));


//CREATE - add new destination to DB
router.post("/", isLoggedIn, upload.single('image'), function(req, res){
  // get data from form and add to destinations array
 

  geocoder.geocode(req.body.destination.location, function (err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.destination.lat = data[0].latitude;
    req.body.destination.lng = data[0].longitude;
    req.body.destination.location = data[0].formattedAddress;

    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the destination object under image property
      req.body.destination.image = result.secure_url;
      //add images public id to destination object
      req.body.destination.imageId = result.public_id;
      // add author to destination
      req.body.destination.author = {
        id: req.user._id,
        username: req.user.username
      }
      Destination.create(req.body.destination, function(err, destination) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        req.flash("success", "successfully added your destination");
        res.redirect('/destinations/'+ destination.id);
      });
    });
  });
});

router.get('/', function(req, res, next) {

  Destination.find({}, function(err, alldestinations){
    if (err) throw err;
    res.render('destinations', {destinations: alldestinations, currentUser: req.user});
    })
});


router.get('/new', isLoggedIn, function(req, res, next) {
  res.render('adddestination');
});


//show
router.get('/:id', function(req, res, next) {
  Destination.findById(req.params.id).populate('comments').exec(function(err, destinationFound){
    if (err) throw err;
    // console.log(destinationFound)
    res.render('showdestination', {destination: destinationFound });
  });
});

//comment
router.get('/:id/comments/new', isLoggedIn, function(req, res, next) {
  Destination.findById(req.params.id, function(err, destination){
    if (err) throw err;
    res.render('newcomment', {destination: destination});
  })
});

router.post('/:id/comments/', isLoggedIn, function(req, res, next) {
  Destination.findById(req.params.id, function(err, destination){
    if (err) {
      console.log(err);
      res.redirect('destinations')
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          //add c to u
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          destination.comments.push(comment);
          destination.save();
          req.flash("success", "successfully created your comment");
          res.redirect('/destinations/' + destination._id)
        }
      }) 
    }
    })
  });

  //edit
  router.get('/:id/edit/', checkDestOwnership, function(req, res, next) {
        Destination.findById(req.params.id, function(err, foundDest){
          if (err) throw err;
          res.render("editdestination", {destination: foundDest});  
      });
  });


  ///update
  router.put("/:id", checkDestOwnership, upload.single('image'), function(req, res){
    Destination.findById(req.params.id, function(err, destination){
      if(err){
        req.flash("error", err.message);
        res.redirect("back");
       } else {
    geocoder.geocode(req.body.destination.location, async function (err, data) {
      if (err || !data.length) {
        // console.log(req.body.destination.location)
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      // console.log(req.body.destination)
      req.body.destination.lat = data[0].latitude;
      req.body.destination.lng = data[0].longitude;
      req.body.destination.location = data[0].formattedAddress;

            if(req.file) {
              try{
                await cloudinary.v2.uploader.destroy(destination.imageId);
                var result = await cloudinary.v2.uploader.upload(req.file.path);
                destination.imageId = result.public_id;
                destination.image = result.secure_url;
              } catch (err) {
                req.flash("error", err.message);
                return res.redirect("back");
              }
            }
            destination.name = req.body.destination.name;
            destination.description = req.body.destination.description;
            destination.lat = req.body.destination.lat;
            destination.lng = req.body.destination.lng;
            destination.location = req.body.destination.location;
            destination.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/destinations/" + req.params.id);
          });
          }
    });
  });

//delete
  router.delete('/:id', checkDestOwnership, function(req, res, next) {
    Destination.findById(req.params.id, async function(err, destination){
      if(err){
        req.flash("error", err.message);
        return res.redirect("back");
      }
      try {      
        await cloudinary.v2.uploader.destroy(destination.imageId);
        destination.remove();
        req.flash('success', 'destination successfully deleted');
        res.redirect('/destinations')
      } catch (err) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect('back');
        }
      }
    });
  });

  function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    req.flash("error", "Please login to use the features of this site");
    res.redirect('/login');
  }

    function checkDestOwnership(req, res, next){
  if(req.isAuthenticated()){
    Destination.findById(req.params.id, function(err, foundDest){
      if (err){
        req.flash("error", "not found..database issue");
        res.redirect('back')
      } else {
          if(foundDest.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash("error", "No Permission to access this feature");
            res.redirect('back')
          }
      }
  });
} else {
  req.flash("error", "Please login to use the features of this site");
  // console.log("This feature is only avialable for registered users");
  res.redirect('back');
}
}

module.exports =   router;
