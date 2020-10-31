'use strict';

const base64 = require('base-64');

const Users = require('../model/userModel');

module.exports = async (req, res, next)=>{

  let error = { 'message_spec': 'Invalid User ID/Password', 'statusCode': 401, 'statusMessage': 'Unauthorized' };

  if (! req.headers.authorization) {
    next(error);
    return;
  }

  try{
    let basic = req.headers.authorization.split(' ').pop();
    let [user, pass] = base64.decode(basic).split(':');
    const validUser = await Users.authenticateBasic(user, pass);
    if (validUser) {
      const token = validUser.tokenGenerator();
      req.token = token;
      next();
    } else {
      next(error);
      return;
    }
  }
  catch (err) {
    next(err);
  }
};
