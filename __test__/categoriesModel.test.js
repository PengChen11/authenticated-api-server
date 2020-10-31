'use strict';

require('@code-fellows/supergoose');


const categories = require('../src/model/categoryModel');

afterEach(async()=>{
  await categories.deleteMany({});
});

let testObject = { name: 'fruit', description: 'Some vegi you can eat raw' };

describe('products Model', () => {
  it('can create() a new products', async () => {
    const result = await new categories(testObject).save();
    Object.keys(testObject).forEach(key => {
      expect(result[key]).toEqual(testObject[key]);
    });
  });

  it('can get() products', async() => {
    await new categories(testObject).save();
    let result = await categories.find({});

    Object.keys(testObject).forEach(key => {
      expect(result[0][key]).toEqual(testObject[key]);
    });
  });

});
