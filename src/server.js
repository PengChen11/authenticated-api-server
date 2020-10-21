'use strict';
const express = require('express');
const app = express();

//global middleware
app.use(express.json());
app.use(express.static('./public'));
const timeStamp = require('./middleware/timestamp.js');
app.use(timeStamp);
const logger = require('./middleware/logger.js');
app.use(logger);

//router
const router = require('./routes/router.js');
app.use(router);

// routes error handlers
const fourOfour = require('./middleware/404');
app.use('*', fourOfour);
const svrErrors = require('./middleware/error');
app.use(svrErrors);

module.exports = {
  server: app,
  start: port => {
    let PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));

  },
};
