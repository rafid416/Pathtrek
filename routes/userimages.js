var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
  //mongo
  const mongoURI = 'mongodb+srv://pathtrek:pathtrek@mycluster-smjf2.mongodb.net/pathtrek?retryWrites=true&w=majority';
  
  //crea mongo connection:
const conn = mongoose.createConnection(mongoURI);

let gfs;
//init stream
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('userimages')
})

router.get('/:filename', (req, res)=> {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        console.log(req.params.filename)
        //check if any files
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: 'No files exists'
          });
        }

        if(file.contentType === "image/jpeg" || file.contentType === 'img/png') {
          //read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);  
        } else {
            res.status(404).json({
                err: 'not an image'
            });
        };
      });
    });
    module.exports = router;