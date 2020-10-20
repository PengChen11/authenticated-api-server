'use strict';
module.exports = (err, req, res, next) => {
  let error = { error: err.message || err };
  res.statusCode = err.status || 500;
  res.statusMessage = err.statusMessage || 'Server internal error occurred. Please try again later.';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error.error) );
  res.end();
};
