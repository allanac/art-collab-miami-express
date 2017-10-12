const express = require('express');
const multer = require('multer');

const MediaModel = require('../models/media-model');

const router = express.Router();

const myUploader =
multer(
  {
    dest: __dirname + '/../public/uploads'
  }
);

// ---------- GET /API/MEDIA --------- (latest media) //
router.get('/media', (req,res, next) => {
    MediaModel.find()
      .limit(10)
      .sort({ timestamps: -1})
      .populate('owner', { encryptedPassword: 0 })
      .exec((err, recentMedia) => {
          if(err){
            res.status(500).json({errorMessage: 'Finding Media went wrong'});
            return;
          }
          res.status(200).json(recentMedia);
      });
});

// ---------- GET /API/MEDIA --------- (popular) //
router.get('/media/popular', (req,res, next) => {
    MediaModel.find()
      .limit(10)
      .sort({ likes: 1 })
      .exec((err, popularMedia) => {
          if(err){
            res.status(500).json({errorMessage:'Finding popular media went wrong'});
            return;
          }
          res.status(200).json(popularMedia);
      });
}); // GET api/media (popular)

// ---------- GET /API/MEDIA/SEARCH --------- (search) //

router.get('/media/:searchTerm', (req,res,next) => {

  // let mySearchRegex = "mamabee";
  let mySearchRegex = new RegExp(req.params.searchTerm, 'i');
  console.log('MY Search Regex-->', mySearchRegex);
  mySearchRegex.toString()

  MediaModel.find(
    { team: mySearchRegex,
      $or:[
            {title: mySearchRegex},
            {team: mySearchRegex},
            {status: mySearchRegex},
            {category: mySearchRegex},
            {owner: mySearchRegex},
          ]
        },

    (err, searchResults) => {
      if(err){
        console.log('she likes cows');
        res.status(500).json({errorMessage:'Getting search results went wrong'});
        return;
      }
      res.status(200).json(searchResults);
    }

  ); //MediaModel.find()
});




// ---------- POST /API/MEDIA --------- //
router.post('/media/', myUploader.single('mediaFile'), (req, res, next) => {
  if (!req.user){
    res.status(401).json({errorMessage: 'Not logged in'});
    return;
  }

  const theMedia = new MediaModel({
      title:req.body.mediaTitle,
      team:req.body.mediaTeam,
      status: req.body.mediaStatus,
      category: req.body.mediaCategory,
      owner: req.user._id
  });

  if(req.file) {
    theMedia.mediaFile = '/uploads/' + req.file.filename;
  }

  theMedia.save((err) => {
      if (theMedia.errors){
          res.status(400).json({
              errorMessage:'Validating Media failed',
              validationErrors: theMedia.errors
          });
          return;
      }
      if(err){
        console.log('Error posting Media', err);
        res.status(500).json({errorMessage:'Adding new Media went wrong'});
        return;
      }
      res.status(200).json(theMedia);

  }); //theMedia.save()
}); // POST /api/media

// ---------- POST /API/MEDIA/:id/like --------- (isLiked) //
router.post('/media/:id/like', (req, res, next) => {
  isLiked = false;

});

// ---------- DELETE /API/MEDIA --------- //
router.delete('/media/:mediaId', (req, res, next) => {
  if(!req.user) {
    res.status(401).json({errorMessage: 'Not logged in'});
    return;
  }

  MediaModel.findById(
    req.params.mediaId,
      (err, mediaFromDb) => {

          if(err){
            console.log('Media owner confirm Error', err);
            res.status(500).json(
              {errorMessage: 'Media ownner confirm went wrong'}
            );
            return;
          }

          if(mediaFromDb.owner.toString() !== req.user._id.toString()){
            res.status(403).json({errorMessage: 'Phone not yours'});
            return;
          }
          MediaModel.findByIdAndRemove(
            req.params.mediaId,
            (err, mediaFromDb) => {
                if(err){
                  console.log('Media Delete Error', err);
                  res.status(500).json({errorMessage: 'Media Delete went wrong'});
                  return;
                }
                res.status(200).json(mediaFromDb);
            }
          ); //findByIdAndRemove

      }// err, mediaFromDb
  );// findById()
});

// GET my MEDIA /api/mymedia/
router.get('/mymedia', (req,res,next) => {
    if(!req.user) {
      res.status(401).json({ errorMessage: 'Not logged in!'});
      return;
    }

    MediaModel.find({owner: req.user._id})
      .sort({timestamps: -1})
      .exec((err, myMediaResults) => {
          if(err){
            res.status(500).json({errorMessage:'My Media Went Wrong'});
            return;
          }
          res.status(200).json(myMediaResults);
      });
});


module.exports = router;
