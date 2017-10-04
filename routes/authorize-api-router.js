const express  = require('express');
const bcrypt   = require('bcrypt');
const passport = require('passport');

const UserModel = require('../models/user-model');

const router = express.Router();

// ---------- /API/SIGNUP --------- //
router.post('/signup', (req,res,next) => {
  if(!req.body.signupUsername || !req.body.signupPassword){
      res.status(400).json({ errorMessage: 'Username & Password Required'});
      return;
  }

  UserModel.findOne(
    {username: req.body.signupUsername},
    (err, userFromDb) => {
        if(err){
            res.status(500).json({errorMessage:'Error Finding username'});
            return;
        }
        if(userFromDb){
          res.status(400).json({errorMessage:'Sorry! That username istaken'});
          return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.signupPassword, salt);

        const theUser = new UserModel({
            username: req.body.signupUsername,
            encryptedPassword = hashPassword
        });

        theUser.save((err) => {
            if(err){
              res.status(500).json({ errorMessage: 'Error saving user.'});
              return;
            }
            //log user in automatically after signup
            req.login(theUser, (err) => {
                if(err){
                    res.status(500).json({ errorMessage: 'Error logging in user'});
                    return;
                }

                //clear out the password from any information sent
                theUser.encryptedPassword = undefined;
                res.status(200).json(theUser);
            }); //req.login()
        }); //theUser.save()
    }
  ); //UserModel.findOne()
}); // POST api/signup


// ---------- /API/LOGIN --------- //
router.post('/login', (req,res,next) => {
    const customAuthCallback =
    passport.authenticate('local', (err, theUser, extraInfo) => {
        if(err){
          res.status(500).json({errorMessage: 'Login failed'});
          return;
        }
        if(!theUser){
          res.status(401).json({errorMessage: extraInfo.message});
          return;
        }
        req.login(theUser,(err) => {
            if(err){
              res.status(500).json({errorMessage:'Login failed'});
              return;
            }
            theUser.encryptedPassword = undefined;
            res.status(200).json(theUser);
        }); //req.login()
    }); //passport.authenticate('local')
    customAuthCallback(req,res,next);
}); // POST /api/login


// ---------- /API/CHECKLOGIN --------- //
router.get('/checklogin', (req,res,next) => {
    let amIloggedIn = false;

    if(req.user){
      req.user.encryptedPassword = undefined;
      amIloggedIn = true;
    }
    res.status(200).json(
      { isLoggedIn : amIloggedIn, userInfo: req.user}
    ); //res.status
}); // GET /api/checklogin


// ---------- /API/LOGOUT --------- //
router.delete('/logout', (req,res,next) => {
    req.logout();
    res.status(200).json({successMessage: 'Log out success!'});
});


module.exports = router;
