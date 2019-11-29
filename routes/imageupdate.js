var express = require('express');
var router = express.Router();
var multer = require('multer');
var User = require('./user');

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
  api_secret: process.env.CLOUDINARY_API_SECRET
});


var app = express();
app.use(express.urlencoded({ extended: true }));


//CREATE - add new destination to DB
router.post("/", upload.single('image'), function(req, res){

  User.findById(req.user.id, async function(err, user){
    console.log(req.user.id)
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
     } else {
        try{
          await cloudinary.v2.uploader.destroy(user.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          // add cloudinary url for the image to the destination object under image property
          user.image = result.secure_url;
          //add images public id to destination object
          user.imageId = result.public_id;
          } catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
        
        console.log(user.image)
        console.log(user.imageId)
 
        user.save();
        req.flash("success", "successfully updated your profile picture");
        res.redirect('profile');
    }
  });
});
module.exports = router;