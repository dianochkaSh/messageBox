const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const db = require('./db/index');
const http = require('http');
const history = require('connect-history-api-fallback');
const sharedsession = require("express-socket.io-session");
const sessionStore = require('sessionstore');
const passportSocketIo = require("passport.socketio");
const app = express();
app.locals.usersChat = [];
app.locals.currentSocket = '';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
let ss = sessionStore.createSessionStore({
});
let sessionMiddleware = session({
  secret: 'ilovechocolate',
  key: 'express.sid',
  resave: false,
  saveUninitialized: true,
  unset: 'keep',
  cookie: {
    maxAge: 2419200000
  }
});
app.use(sessionMiddleware);

/* init passport */
app.use(passport.initialize());
app.use(passport.session());

/* init data base*/
db.init();


//work
app.use(express.static(path.join(__dirname, '../public')));

app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', function(req,res) {
  //req.session();
  res.render(path.join(__dirname, '../public/index.html'));
});

require('./routes/index.js')(app, passport);
require('./passport/index.js')(passport);

const serverPort = 8081;
const server = app.listen(serverPort, function() {
  console.log('server running on port 8081');
});
const io = require('socket.io', {reconnect: true})(server);
const cookie = require('cookie');
const UserService = require('../server/db/services/userService');

io.use(function(socket, next) {
 sessionMiddleware(socket.request, socket.request.res, next);
});


io.on('connection', function(socket) {
  app.locals.currentSocket = socket.id;
  socket.on('login', function(data) {
    io.emit('allUsersInChat', {usersChat: app.locals.usersChat});
  });

  socket.on('logout', function(data){
    io.emit('allUsersInChat', {usersChat: app.locals.usersChat});
    socket.disconnect(socket.id);
  });
  socket.on('sendMessage', function(data) {
    if (socket.request.sessionID) {
      let sessionObject =  JSON.parse(socket.request.sessionStore.sessions[socket.request.sessionID]);
      UserService.getUserById(sessionObject.passport.user)
        .then((user) => {
          if (data.userTo !== 0) {
            let currentUser = app.locals.usersChat.filter((crUser) => {
              return crUser.id  === data.userTo;
            });
            io.emit('messagesPrivate', {
              username: user.username,
              message: data.message,
              userTo: currentUser[0].username,
              userToId: currentUser[0].id,
              userId: user.id
            });
            io.of(socket.request.sessionID).to(currentUser[0].sId).emit('messagesPrivate', { username: user.username, message: data.message, userTo: currentUser[0].username });
          } else {
            io.emit('messageChannel', { username: user.username, message: data.message });
          }
        });
    }
  });
});
