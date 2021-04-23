var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

/*
router.get('/upload', function(req, res, next){
  res.render('upload');
});
*/

router.post('/upload', function(req, res, next){
  // console.log(req.body);
  var base64 = req.body.data.split(',')[1];
  var decode = new Buffer.from(base64, 'base64');
  var t = Math.floor(Math.random() * 100);
  fs.writeFile(`uploads/${String(t)}.png`, decode, (err) => {
    if(err){
      console.log(err);
    }else{
      console.log('saved');
    }
  });
  res.send('{"filename":"'+t+'.png"}');
});

/*
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
*/

/*
router.post('/register', multer({storage: storage}).single('image'), function(req, res, next) {
  console.log(req.file);
  res.render('upload', {message: 'Successfully uploaded the image!'});
});
*/

router.get('/uploadedList', function(req, res, next){
  fs.readdir('uploads', function(err, files){
    if(err) throw err;
    res.json(files);
  })
});

router.get('/aquarium', function(req, res, next){
  res.render('aquarium');
});

module.exports = router;
