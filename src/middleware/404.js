'use strict';

module.exports = (req,res,next) => {
  let error = 'The web resource you requested does not exsit';
  res.statusCode = 404;
  res.statusMessage = error.error;
  res.send(error);
  res.end();
};
