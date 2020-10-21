'use strict';
module.exports = (err, req, res, next) => {
  console.log(err);
  res.statusCode = err.status || 500;
  res.statusMessage = 'Server internal error occurred. Please try again later.';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(res.statusMessage) );
  res.end();
};
