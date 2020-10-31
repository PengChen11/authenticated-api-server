'use strict';

const Users = require('../../model/userModel');

async function signup (req, res, next){
  let missingKeyError = { 'message_spec': 'username, password and role are all required when registering a new user, please try again', 'statusCode': 403, 'statusMessage': 'Missing Key info' };

  let requiredKeys = ['username', 'password', 'role'];
  let userInput = Object.keys(req.body);
  if (!requiredKeys.every(key=>userInput.includes(key))) {
    next(missingKeyError);
    return;
  }

  let uniqueError = { 'message_spec': 'Username taken, please choose another one', 'statusCode': 403, 'statusMessage': 'Unique Fail' };
  try {
    let user = new Users(req.body);
    let valid = await Users.findOne({username: user.username});
    if(!valid){
      try{
        let savedUser = await user.save();
        let token = savedUser.tokenGenerator();
        res.status(200).send({token:token});
      } catch (error) {
        next(error);
      }
    } else {
      next(uniqueError);
    }
  }
  catch (err){
    next(err);
  }
}

async function signin (req, res, next){
  res.cookie('auth', req.token);
  res.send({token: req.token});
}

module.exports = {signup, signin};
