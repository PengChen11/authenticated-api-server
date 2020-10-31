'use strict';

const modelFinder = require('../../src/middleware/modelFinder');
const Product = require('../../src/model/productModel');
const Category = require('../../src/model/categoryModel');


describe('test model finder', ()=>{
  let res = {};
  let next = jest.fn();

  it('it should find current model', ()=>{
    let req = {params:{model:'products'}};
    modelFinder(req, res, next);
    expect(req.model).toBe(Product);

    req = {params:{model:'categories'}};
    modelFinder(req, res, next);
    expect(req.model).toBe(Category);

  });

  it('should set no model when passing non exsiting model in request', ()=>{
    let req = {params:{model:'bad-model'}};
    modelFinder(req, res, next);
    expect(req.model).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
