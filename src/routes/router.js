'use strict';

const express = require('express');
const router = express.Router();
const modelFinder = require('../middleware/modelFinder');

router.param('model', modelFinder);

// API routes Definitions
const {getAll, getOne, createOne, updateOne, deleteOne} = require('./routeHandler/apiRoutesHandler');
router.get('/sales/:model', getAll);
router.get('/sales/:model/:id', getOne);
router.post('/sales/:model', createOne);
router.put('/sales/:model/:id', updateOne);
router.delete('/sales/:model/:id', deleteOne);

// User routes definitions
const {signup, signin} = require('./routeHandler/userRoutesHandler');
router.post('/users/signup', signup);
router.post('/users/signin', signin);


module.exports = router;
