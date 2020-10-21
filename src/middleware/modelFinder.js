'use strict';
const product = require('../model/productModel');
const category = require('../model/categoryModel');

module.exports = (req, res, next)=>{
  let model = req.params.model;

  switch (model) {
  case 'products':
    req.model = product;
    next();
    return;
  case 'categories':
    req.model = category;
    next();
    return;
  default:
    next();
    return;
  }
};

