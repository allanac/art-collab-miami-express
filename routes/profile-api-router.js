const express = require('express');
const multer = require('multer');
const UserModel = require('../models/user-model');
const router = express.Router();

const myUploader = multer({dest:__dirname + '/../public/uploads'});

// ---------- /API/PROFILE --------- //
router.get('/profile', (req,res,next) => {
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
router.put('/profile/:userId', myUploader.single('userImage'), (req, res, next) => {
  console.log('I am inside the api/profile/put user --------') // DELETE BEFORE DEPLOYMENT
  console.log(req.user);  // DELETE BEFORE DEPLOYMENT

  if(!req.user) {
    res.status(401).json({errorMessage:'Not logged in.'});
    return;
  }


  UserModel.findById(req.params._id, (err, userFromDb) => {
    console.log('Here in the FIND by ID Profile api router - line 36');
    console.log(req.user);

    if(err){
      console.log('User profile error', err);
      res.status(500).json({ errorMessage: 'User profile went wrong'});
      return;
      }

    // var updateDoc = req.body;
    // delete updateDoc._id;

    userFromDb.set({
      fullName:req.body.userFullName,
      genre: req.body.userGenre,
      artForm: req.body.userArtForm,
      artTools: req.body.userArtTools,
      collabStyle:req.body.userCollabStyle,
      bio: req.body.userBio
    });

    if(req.file){userFromDb.profilePic = '/uploads/' + req.file.filename;}

    // userFromDb.updateOne(
    //   {_id:req.params.id }, updateDoc,
    //   (err, doc) => {
    //     if(err){
    //       res.status(500).json({ errorMessage: 'Failed to update usere Profile'});
    //       return;
    //     }
    //     else{
    //       res.status(200).json(req.params.id);
    //     }
    //   }//updateDoc
    //   ); //updateOne

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
router.delete('/profile/:userId', (req,res,next) => {
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



module.exports = router;
