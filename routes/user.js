var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    image: String,
    imageId: String
  });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema)