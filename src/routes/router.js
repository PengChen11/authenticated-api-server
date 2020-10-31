'use strict';

const express = require('express');
const router = express.Router();
const modelFinder = require('../middleware/modelFinder');
const oAuth = require('../middleware/oAuth');
const permissions = require('../middleware/acl');

router.param('model', modelFinder);

// API routes Definitions
const {getAll, getOne, createOne, updateOne, deleteOne} = require('./routeHandler/apiRoutesHandler');
const bearer = require('../middleware/bearer');
router.get('/sales/:model', bearer, getAll);
router.get('/sales/:model/:id',bearer, getOne);
router.post('/sales/:model', bearer,permissions('create'), createOne);
router.put('/sales/:model/:id', bearer,permissions('update'), updateOne);
router.delete('/sales/:model/:id', bearer,permissions('delete'), deleteOne);

// User routes definitions
const {signup, signin} = require('./routeHandler/userRoutesHandler');
router.post('/users/signup', signup);
const basicAuth = require('../middleware/basicAuth');
router.post('/users/signin', basicAuth, signin);

//oAuth login
router.get('/oauth', oAuth, (req, res)=>{
  res.status(200).send(req.token);
});


module.exports = router;
