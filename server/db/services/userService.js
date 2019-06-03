let User = require('../models/userModel');
let ObjectId = require('mongodb').ObjectID;

/* change data user */
exports.changeUser = (user) => {
  return user.save();
};

/**
 * get User by id
 * @param id - id user
 */
exports.getUserById = (id) => {
  return User.findOne({ '_id': ObjectId(id) }).exec();
};
/**
 * get user by email
 * @param email - email user
 * @returns object user
 */
exports.getUserByEmail = (email) => {
  return User.findOne({ 'email': email }).exec();
};

/**
 * get user by username
 * @param username - name user
 * @returns {*}
 */
exports.getUserByUsername = ( username ) => {
  return User.findOne({ 'username': username }).exec();
};
