let UserService = require('../db/services/userService');

module.exports = function (app, passport) {
  app.get('/', function (req, res, next) {
    res.send('respond with a resource');
  });
  /**
   * registration user
   */
  app.post('/registration', function (req, res, next) {
    passport.authenticate('local-signup', function (err, users) {
      if (users) {
        req.logIn(users, function (err) {
          if (err) {
            return res.send({'error': err});
          }
          UserService.getUserById(req.user.id)
            .then(user => {
              let currentUser = {};
              if (app.locals.usersChat.length > 0) {
                let userInUsersChat = app.locals.usersChat.filter((userChat) => {
                  return userChat.username !== user.username;
                });
                if (userInUsersChat.length > 0) {
                  let objUser = { id: user.id, username: user.username,  sId: app.locals.currentSocket };
                  app.locals.usersChat.push(objUser);
                }
              } else {
                let objUser = { id: user.id, username: user.username };
                app.locals.usersChat.push(objUser);
              }
              return res.send({
                'ok': 1,
                'id': user.id,
                'user': req.user.username,
                'email': req.user.email,
                'usersAll': app.locals.usersChat
              });
            });
        });
      } else {
        return res.send({ 'error': err });
      }
    })(req, res, next);
  });

  /**
   * log in user
   */
  app.post('/enter', function (req, res, next) {
    passport.authenticate('local-login', function (err, user) {
      if (user) {
        req.logIn(user, function (err) {
          if (err) {
            return res.send({ 'error': 'User does not authorization. ' });
          } else {
            UserService.getUserById(req.user.id)
              .then(user => {
                let currentUser = { id: user.id, username: user.username, sId: app.locals.currentSocket };
                if (app.locals.usersChat.length > 0) {
                  let objUser = app.locals.usersChat.filter((userChat) => {
                    return userChat.username === user.username;
                  });
                  if (objUser.length === 0) {
                    app.locals.usersChat.push(currentUser);
                  } else {
                    return res.send({ 'error': 'User does not authorization. Current user is already in chat.' });
                  }
                } else {
                  app.locals.usersChat.push(currentUser);
                }
                return res.send({ 'ok': 1,
                  'username': user.username,
                  'email': user.email,
                  'id': user.id,
                  'usersAll': app.locals.usersChat
                });
              });
          }
        });
      }
      if (err) {
        return res.send({ 'error': err });
      }
    })(req, res, next);

  });
  /**
   * log out user
   */
  app.get('/logout', function (req, res) {
    let id = req.session.passport.user;
    UserService.getUserById(req.user.id)
      .then(user => {
        if (app.locals.usersChat.length > 0) {
          app.locals.usersChat.forEach((userChat, index) => {
            if (userChat.username === user.username) {
              let objUser = { id: user.id, username: user.username };
              app.locals.usersChat.splice(index, 1);
            }
          });
        }
        req.logOut();
        req.session.destroy((err) => {
          res.clearCookie('connect.sid');
            res.send({ ok: 1, message: 'logout success!', 'usersAll': app.locals.usersChat });
        });
      });
  });

  /**
   * check user is authorization
   */
  app.get('/checkEnterUser', function (req, res) {
    if (req.isAuthenticated()) {
      let userId  = req.session.passport.user;
      UserService.getUserById(userId)
        .then((user) => {
          return res.send({ 'ok': 1, user: user });
        })
        .catch((error) => {
          return res.send({ 'errorAuthorization': 'User ar not authorization' });
        });
    } else {
      return res.send({ 'errorAuthorization': 'User ar not authorization' });
    }
  });
};
