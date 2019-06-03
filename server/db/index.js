let mongoose = require('mongoose');

let init = function () {
  mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true } );
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log("Mongo" + "mongodb://localhost/chat work");
  });
};

exports.init = init;
