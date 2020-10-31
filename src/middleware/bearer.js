'use strict';
require('dotenv').config();

const User = require('../model/userModel');

module.exports = async (req, res, next) => {

  if (process.env.AUTH_SWITCH==='off') {
    next();
    return;
  }

  let invalidErr = {message_spec: 'You are not authorized. Please try to login again.', statusCode: 401, statusMessage:'Unauthorized'};

  if (!req.headers.authorization) {
    next(invalidErr);
    return;
  }

  let token = req.headers.authorization.split(' ').pop();



  let validUser;
  try{
    validUser = await User.authenticateToken(token);
  }
  catch (err){
    next(invalidErr);
    return;
  }

  // req.user = validUser;
  req.token = token;

  /* Lab 14 - add capabilities key/value pair */
  req.user = {
    username: validUser.username,
    fullname: validUser.fullname,
    email: validUser.email,
    capabilities: validUser.capabilities,
  };

  next();
};
