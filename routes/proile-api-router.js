const express = require('express');
const multer = require('multer');
const UserModel = require('../models/user-model');
const router = express.Router();

const myUploader = multer({dest:__dirname + '/../public/uploads'});

// ---------- /API/PROFILE --------- //
router.get('/profile', (req,res,next) => {
  console.log('The /API/PROFILE User: -------'); // DELETE THIS LINE BEFORE DEPLOYMENT
  console.log(theUser); // DELETE THIS LINE BEFORE DEPLOYMENT

  UserModel.findById(req.user._id,(err,userFromDb) => {
    if(err){res.status(500).json({errorMessage:'Finding user went wrong'})
    return;
  }
  res.status(200).json(userFromDb);
  });
}); // GET/API/PROFILE

// ---------/API/PROFILE/:USERID
router.put('/profile/:userId', myUploader.single('userImage'), (req, res, next) => {
  console.log('I am inside the api/profile/put user --------') // DELETE BEFORE DEPLOYMENT
  console.log(req.user);  // DELETE BEFORE DEPLOYMENT

  if(!req.user) {
    res.status(401).json({errorMessage:'Not logged in.'});
    return;
  }

  UserModel.findById(req.params.userId(err, userFromDb) => {
    if(err){
      console.log('User profile error', err);
      res.status(500).json({ errorMessage: 'User profile went wrong'});
      return;
    }

    userFromDb.set({
      fullName:req.body.userFullName,
      genre: req.body.userGenre,
      artForm: req.body.userArtForm,
      artTools: req.body.userArtTools,
      collabStyle:req.body.userCollabStyle,
      bio: req.body.userBio
    });

    if(req.file){userFromDb.userPic = '/uploads' + req.file.filename;}

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
        res.ststus(500).json({errorMessage:'User profile update went wrong'});
        return;
      }
      res.status(200).json(userFromDb);
    }); //userFromDb.save()
  } // user.findById
);//.findById()
}); // PUT API/:USERID/EDIT


module.exports = router;
