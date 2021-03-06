const express = require('express');
const multer = require('multer');
const UserModel = require('../models/user-model');
const router = express.Router();

// const myUploader = multer({dest:__dirname + '/../public/uploads'});
const myUploader = require('../config/multer-config');

// ---------- /API/PROFILE --------- //
router.get('/myprofile', (req,res,next) => {
  if(!req.user) {
    res.status(401).json({errorMessage:'Not logged in.'});
    return;
  }
  console.log('The /API/PROFILE User: -------'); // DELETE THIS LINE BEFORE DEPLOYMENT
  console.log(req.user); // DELETE THIS LINE BEFORE DEPLOYMENT

  UserModel.findById(req.user._id, (err,userFromDb) => {
    if(err){
      res.status(500).json({errorMessage:'Finding user went wrong'});
      return;
    }
    res.status(200).json(userFromDb);
  });
}); // GET/API/PROFILE



// ---------/API/PROFILE/:USERID ----- //
router.put('/myprofile/', myUploader.single('userImage'), (req, res, next) => {

  if(!req.user) {
    res.status(401).json({errorMessage:'Not logged in.'});
    return;
  }


  UserModel.findById(req.user._id, (err, userFromDb) => {

    if(err){
      console.log('User profile error', err);
      res.status(500).json({ errorMessage: 'User profile went wrong'});
      return;
      }

    userFromDb.set({
      fullName:req.body.userFullName,
      artForm: req.body.userArtForm,
      genre: req.body.userGenre,
      collabStyle:req.body.userCollabStyle,
      artTools: req.body.userArtTools,
      bio: req.body.userBio
    });
    if(req.file){
      // userFromDb.profilePic = '/uploads/' + req.file.filename;
      userFromDb.profilePic = req.file.location;
    }

    console.log('After set before save - line 57');
    console.log(req.user);


    userFromDb.save((err) => {
      if(userFromDb.errors){
        res.status(400).json({
          errorMessage: 'Update validation failed',
          validationErrors: userFromDb.errors
        });
        return;
      }
      if(err) {
        console.log('USER UPDATE ERROR', err);
        res.status(500).json({errorMessage:'User profile update went wrong'});
        return;
      }
      res.status(200).json(userFromDb);
    }); //userFromDb.save()
  } // user.findById
);//.findById()
}); // PUT /API/PROFILE/:USERID ----- //


// ---------/API/PROFILE/:USERID (DELETE)----- //
router.delete('/myprofile/:userId', (req,res,next) => {
  if(!req.user){
    res.status(401).json({errorMessage: 'Not logged in.'});
    return;
  }

  UserModel.findById(req.params.userId, (err, userFromDb) => {
    if(err){
      console.log('User confirm Error', err);
      res.status(500).json({errorMessage:'User confirm went wrong'});
      return
    }

    if(userFromDb._id.toString() !== req.user._id.toString()){
      res.status(403).json({errorMessage: 'This is not your account!!!'});
      return;
    }

    UserModel.findByIdAndRemove(req.params.userId, (err, userFromDb) => {
      if(err){
        console.log('User Delete error', err);
        res.status(500).json({errorMessage: 'User delete went wrong'});
        return;
      }
      res.status(200).json(userFromDb);
    }); //findByIdAndRemove()
  });// UserModel.findById ()
}); // delete API/PROFILE/:USERID

// API GET /api/profile/:userId
router.get('/profile/:userId', (req, res, next) =>  {
  UserModel.findById(
    req.params.userId,
      (err, userFromDb) => {
        if (err) {
          console.log('User find error');
          res.status(500).json({ errorMessage: 'User find went wrong'});
          return;
        }
        res.status(200).json(userFromDb);
      }
  )
});

module.exports = router;
