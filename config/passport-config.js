const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model');

//serializeUser will determine what to save in the session after loggin in
passport.serializeUser((userFromDb, done) => {
    done(null, userFromDb._id);
});

//determine what will become "req.user" on every request
passport.deserializeUser((idFromSession, done) => {
    UserModel.findById(
        idFromSession, (err, userFromDb) => {
            if(err){
               done(err);
               return;
            }
            done(null, userFromDb); //userFromDb --> "req.user"
        }
    );
});

// LocalStrategy from passport-local -- login with username and password
passport.use(
    new LocalStrategy(
        {
          usernameField: 'loginUsername',
          passwordField: 'loginPassword'
        },
        (sentUsername, sentPassword, done) => {
            UserModel.findOne(
              {username: sentUsername},
              (err, userFromDb) => {
                  if (err){
                    done(err);
                    return;
                  }
                  if(!userFromDb){
                    done(null, false, {message:'That\'s not the right username'});
                  }

                  // setup User encryptedPassword
                  const isPasswordGood = bcrypt.compareSync(sentPassword, userFromDb.encryptedPassword);

                  if(!isPasswordGood){
                    done(null,false, {message:'hmm...That\'s not the right password'});
                    return;
                  }
                  //login Successful "userFromDb" is logged in user.
                  done(null, userFromDb);
              }
            ); // UserModel.findOne()
        }
    ) //LocalStrategy()

); //passport.use()
