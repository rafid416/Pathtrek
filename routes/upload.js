var express = require('express');
var router = express.Router();

var path = require('path');
var crypto = require('crypto');
var mongoose = require('mongoose');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');

  //mongo
const mongoURI = 'mongodb+srv://pathtrek:pathtrek@mycluster-smjf2.mongodb.net/pathtrek?retryWrites=true&w=majority';
  
  //creat mongo connection:
const conn = mongoose.createConnection(mongoURI);

//init gfs
let gfs;
//init stream
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('destimages')
})

//create storrage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (re,file) => {
      return new Promise((resolve, reject) => {
          const filename = file.originalname;
          const fileInfo = {
            filename: filename,
            bucketName: 'destimages'
          };
          resolve(fileInfo);
      });
    },
  });
const upload = multer({storage});


router.get('/', function(req, res, next) {
  res.render('upload')
});

router.post('/', upload.single('file'), function(req, res, next) {
ssn.destname = req.body.destname;
ssn.filename = req.file.originalname
var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://localhost:27017/";
  var url = "mongodb+srv://pathtrek:pathtrek@mycluster-smjf2.mongodb.net/test?retryWrites=true&w=majority"
  MongoClient.connect(url, function (err, db) {
      if (err) throw err;
var dbo = db.db("pathtrek");
var myobj = { destination: ssn.destname, filename: ssn.filename };
dbo.collection("uploads").insertOne(myobj, function (err, res) {
    if (err) throw err;
    // console.log("1 document created!");
    db.close();
    });
  });
// res.json({file: req.file});
res.redirect('destinations')

  });


module.exports = router;