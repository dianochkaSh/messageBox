var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: String,
  password: String,
  email   : String,
  token: String,
  timeToken: Date
});

module.exports = mongoose.model('user', userSchema);
