'use strict';

const express = require('express');
const router = express.Router();
const getModel = require('../middleware/modelFinder');

router.param('model', getModel);
