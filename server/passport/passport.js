let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../db/models/userModel');
let md5 = require('md5');
let UserService = require('../db/services/userService');

module.exports = function ( passport) {
  /* serilization data  and save id  user, save req.session.passport.user */
  passport.serializeUser(function (users, done) {
    done(null, users.id);
  });

  /* deserilization data and save data req.user*/
  passport.deserializeUser(function (id, done) {
    UserService.getUserById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error, null);
      })
  });

  //signup
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      let email = req.body.email;
      let pass = req.body.password;
      let userName = req.body.username;
      let currentUser = new User({
        username: userName,
        email: email,
        password: md5(pass)
      });
      UserService.getUserByUsername(userName)
        .then((user) => {
          if (user !== null) {
            return done('User exist with current username.', null);
          } else {
            UserService.getUserByEmail(email)
              .then((user) => {
                if (user !== null) {
                  return done('User exist with current email.', null);
                } else {
                  UserService.changeUser(currentUser)
                    .then((user) => {
                      if (user) {
                        return done(null, user);
                      } else {
                        return done(err);
                      }
                    })
                    .catch((error) => {
                    })
                }
              })
          }
        })
        .catch((error) => {
        });
    }));

  // passport local strategy, authorization
  passport.use('local-login', new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
    UserService.getUserByEmail(username)
      .then((user) => {
        if (user) {
          let hash = md5(password);
          if (user.password === hash) {
            let users = {
              id: user._id.toString(),
              username: user.username,
              email: user.email
            };
            return done(null, users);
          } else {
            return done('The email or password you entered is incorrect.', null);
          }
        } else {
          return done('There is no account with that email address.', null);
        }
      })
      .catch((error) => {
      })
  }));
};
