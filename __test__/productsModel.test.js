'use strict';

require('@code-fellows/supergoose');

const products = require('../src/model/productModel');

afterEach(async()=>{
  await products.deleteMany({});
});

let testObject = { name: 'apples', category: 'fruit', description: 'A red sweat round shape thing',  price:2.99, inStock:100 };
let testObject2 = { name: 'tomato', category: 'veg', description: 'A red sweat round shape thing',  price:1, inStock:11 };

describe('products Model', () => {
  it('can create() a new products', () => {
    return products.create(testObject)
      .then(record => {
        Object.keys(testObject).forEach(key => {
          expect(record[key]).toEqual(testObject[key]);
        });
      });
  });

  it('can get() products', async () => {
    await products.create(testObject);
    await products.create(testObject2);

    let result = await products.find({});
    expect(result.length).toBe(2);
  });

});
