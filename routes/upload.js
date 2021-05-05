var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var crypto = require('crypto');

/*
router.get('/upload', function(req, res, next){
  res.render('upload');
});
*/

// 画像をアップロードし、tempフォルダに追加
router.post('/upload', function(req, res, next){
  // console.log(req.body);
  var base64 = req.body.data.split(',')[1];
  var decode = new Buffer.from(base64, 'base64');
  var t = Math.floor(Math.random() * 100);
  fs.writeFile(`temp/${String(t)}.png`, decode, (err) => {
    if(err){
      console.log(err);
    }else{
      console.log('saved');
    }
  });
  res.send('{"filename":"'+t+'.png"}');
});

const basic = {username: "gakusei3", password: "fb3cf7ce60e83d199a6a9d10e277ca68b9bd28e2c81f7ee2ed2233bbb6f10958"}
// const basic = {username: "gakusei3", password: "@14pe"}

// 承認前の画像一覧の表示、BASIC認証つき
router.get('/tempList', function(req, res, next){
  const auth = req.get('authorization');
  if(!auth){
    res.set("WWW-Authenticate","Basic realm=Admin only.");
    res.sendStatus(401);
    return;
  }
  let r = auth.match(/^Basic ([a-zA-Z0-9\+\/]*=*)$/);
  if(!r){
    res.set("WWW-Authenticate","Basic realm=Admin only.");
    res.sendStatus(401);
    return;
  }
  r = Buffer.from(r[1], "base64").toString("utf-8").match(/^([^:]+):(.+)$/);
  if(!r){
      res.set("WWW-Authenticate","Basic realm=Admin only.");
      res.sendStatus(401);
      return;
  }
  if(r[1] !== basic.username || crypto.createHash('sha256').update(r[2], 'utf8').digest('hex') !== basic.password){
  // if(r[1] !== basic.username || r[2] !== basic.password){
    res.set("WWW-Authenticate","Basic realm=Admin only.");
    res.sendStatus(401);
    return;
  }
  else{
    fs.readdir('temp', function(err, files){
      if(err) throw err;
      res.render('templist', {files:files});
    });
  }
});

// 画像を承認し、tempフォルダからuploadsフォルダにファイルを移動
router.post('/approval/:filename', function(req, res, next){
  var filename = req.params.filename;
  console.log(__dirname);
  fs.rename(`./temp/${filename}`, `./uploads/${filename}`, (err) => {
    if (err) throw err;
    res.redirect('/tempList');
  });
});

// 画像を承認せず、tempフォルダからファイルを削除
router.post('/denial/:filename', function(req, res, next){
  var filename = req.params.filename;
  fs.unlink(`./temp/${filename}`, (err) => {
    if (err) throw err;
    res.redirect('/tempList');
  });
});

// 承認済み画像のファイル名一覧をjsonで返す
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
