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
  gfs.collection('destimages')
})


router.get('/', (req, res)=> {
    gfs.files.find().toArray((err,files) => {
        //check if files
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        //files exist
        return res.json(files);
    });
  // res.render('files');
});

//display single file object
router.get('/:filename', (req,res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    //check if any files
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No files exists'
      });
    }
    //file exists
    return res.json(file);
  });
});
module.exports = router;
