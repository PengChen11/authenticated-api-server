'use strict';
module.exports = (req, res, next) => {

  var ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || 'No IP detected';

  console.log('\n', `Web request from IP address: "${ip}" `, '\n', `  Using "${req.method}" method`, '\n', `  At ${req.requestTime}`, '\n', `  The requested URL is "${req.path}"`, '\n');
  next();
};
