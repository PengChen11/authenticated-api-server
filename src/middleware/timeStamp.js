'use strict';

function timestamp(req, res, next) {

  let today = new Date();
  let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  let output = `${today.toDateString()}  ${time}`;

  req.requestTime = output;
  next();
}

module.exports = timestamp;
