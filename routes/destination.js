var express = require('express');
var mongoose = require("mongoose");

var destinationSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
  });
  
  var app = express();
  app.use(express.urlencoded({ extended: true }));

  module.exports = mongoose.model("Destination", destinationSchema);