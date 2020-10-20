'use strict';
module.exports = (req,res,next) => {
  let error = { error: 'The web resource you requested does not exsit' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error.error));
  res.end();
};
