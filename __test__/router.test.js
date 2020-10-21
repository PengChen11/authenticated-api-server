'use strict';
const { server } = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

function createProduct(){
  return { name: 'apples', category: 'fruit', description: 'A red sweat round shape thing',  price:2.99, inStock:100 };
}

function createCategories(){
  return { name: 'fruit', description: 'good teast stuff'};
}

describe('products API', () => {

  it('can post() a new product', async () => {
    let obj = createProduct();
    let result = await mockRequest.post('/sales/products').send(obj);
    Object.keys(obj).forEach(key => {
      expect(result.body[key]).toEqual(obj[key]);
    });

  });

  it('can get() a product', async() => {
    let obj = createProduct();
    await mockRequest.post('/sales/products').send(obj);
    let getAfter = await mockRequest.get('/sales/products').send();
    Object.keys(obj).forEach(key => {
      expect(getAfter.body[0][key]).toEqual(obj[key]);
    });
  });

  it('can get() a product by id', async() =>{
    let obj1 = createProduct();
    let obj2 = createProduct();
    obj2.name = 'bananas';

    let obj1Result = await mockRequest.post('/sales/products').send(obj1);
    let obj1ID = obj1Result.body['_id'];
    await mockRequest.post('/sales/products').send(obj2);
    let getAfter = await mockRequest.get(`/sales/products/${obj1ID}`).send();
    expect(getAfter.body[0].name).toBe('apples');
  });

  it('Can update() a product by id', async() =>{
    let obj1 = createProduct();
    let obj2 = createProduct();
    obj2.name = 'bananas';
    let obj1Result = await mockRequest.post('/sales/products').send(obj1);
    let obj1ID = obj1Result.body['_id'];
    await mockRequest.post('/sales/products').send(obj2);
    let testBeforeUpdate = await mockRequest.get(`/sales/products/${obj1ID}`).send();
    expect(testBeforeUpdate.body[0].name).toBe('apples');
    await mockRequest.put(`/sales/products/${obj1ID}`).send(obj2);
    let testAfterUpdate = await mockRequest.get(`/sales/products/${obj1ID}`).send();
    expect(testAfterUpdate.body[0].name).toBe('bananas');
  });

  it('Can delete() a product by id', async() =>{
    let obj1 = createProduct();
    let obj2 = createProduct();
    obj2.name = 'bananas';
    let obj1Result = await mockRequest.post('/sales/products').send(obj1);
    let obj1ID = obj1Result.body['_id'];
    await mockRequest.post('/sales/products').send(obj2);
    let testBeforeDelete = await mockRequest.get(`/sales/products`).send();
    let oriLength = testBeforeDelete.body.length;
    await mockRequest.delete(`/sales/products/${obj1ID}`).send();
    let testAfterDelete = await mockRequest.get(`/sales/products/`).send();
    expect(testAfterDelete.body.length).toBe(oriLength-1);
  });
});


describe('categories API ', () => {

  it('can post() a new category', async () => {
    let obj = createCategories();
    let result = await mockRequest.post('/sales/categories').send(obj);
    Object.keys(obj).forEach(key => {
      expect(result.body[key]).toEqual(obj[key]);
    });
  });

  it('can get() a categories', async() => {
    let obj = createCategories();
    await mockRequest.post('/sales/categories').send(obj);
    let getAfter = await mockRequest.get('/sales/categories').send();
    Object.keys(obj).forEach(key => {
      expect(getAfter.body[0][key]).toEqual(obj[key]);
    });
  });

  it('can get() a categories by id', async() =>{
    let obj1 = createCategories();
    let obj2 = createCategories();
    obj2.name = 'vegi';
    let obj1Result = await mockRequest.post('/sales/categories').send(obj1);
    let obj1ID = obj1Result.body['_id'];
    await mockRequest.post('/sales/categories').send(obj2);
    let getAfter = await mockRequest.get(`/sales/categories/${obj1ID}`).send();
    expect(getAfter.body[0].name).toBe('fruit');
  });

  it('Can update() a categories by id', async() =>{
    let obj1 = createCategories();
    let obj2 = createCategories();
    obj2.name = 'vegi';
    let obj1Result = await mockRequest.post('/sales/categories').send(obj1);
    let obj1ID = obj1Result.body['_id'];
    await mockRequest.post('/sales/categories').send(obj2);
    let testBeforeUpdate = await mockRequest.get(`/sales/categories/${obj1ID}`).send();
    expect(testBeforeUpdate.body[0].name).toBe('fruit');
    await mockRequest.put(`/sales/categories/${obj1ID}`).send(obj2);
    let testAfterUpdate = await mockRequest.get(`/sales/categories/${obj1ID}`).send();
    expect(testAfterUpdate.body[0].name).toBe('vegi');
  });


  it('Can delete() a categories by id', async() =>{
    let obj1 = createCategories();
    let obj2 = createCategories();
    obj2.name = 'vegi';
    let obj1Result = await mockRequest.post('/sales/categories').send(obj1);
    let obj1ID = obj1Result.body['_id'];
    await mockRequest.post('/sales/categories').send(obj2);
    let testBeforeDelete = await mockRequest.get(`/sales/categories`).send();
    let oriLength = testBeforeDelete.body.length;
    await mockRequest.delete(`/sales/categories/${obj1ID}`).send();
    let testAfterDelete = await mockRequest.get(`/sales/categories/`).send();
    expect(testAfterDelete.body.length).toBe(oriLength-1);
  });

  it('test for bad routes', async()=>{
    let result = await mockRequest.get('/badRoute');
    expect(result.status).toBe(404);
  });
});

