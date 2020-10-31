'use strict';
require('dotenv').config();
module.exports = (capability) => {

  return (req, res, next) => {

    if (process.env.AUTH_SWITCH==='off') {
      next();
      return;
    }
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  };

};
