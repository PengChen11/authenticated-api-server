'use strict';
require('dotenv').config();
const { server } = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const User = require('../src/model/userModel');
const Product = require('../src/model/productModel');
const Category = require('../src/model/categoryModel');
// to avoid console to log messages during test;
console.log = jest.fn();
process.env.AUTH_SWITCH='on';
var adminToken;
var userToken;
var productID;
var categoryID;


beforeEach(async()=>{
  let admin = await new User({username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com'}).save();
  let user = await new User({username: 'user', password: 'password', role: 'user', email: 'admin@admin.com'}).save();
  adminToken = admin.tokenGenerator();
  userToken = user.tokenGenerator();
  let product = await new Product(createProduct()).save();
  productID = product._id;

  let category = await new Category(createCategories()).save();
  categoryID = category._id;
});
afterEach(async()=>{
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
});

function createProduct(){
  return { name: 'apples', category: 'fruit', description: 'A red sweat round shape thing',  price:2.99, inStock:100 };
}

function createCategories(){
  return { name: 'fruit', description: 'good teast stuff'};
}

const fakeUser = {
  username: 'janedoe',
  password: 'password',
  role: 'admin',
  email: 'jane@doe.com',
};

describe('user signup/signin tests', ()=>{

  it('should be able to sign up new users', async()=>{
    let user = await mockRequest.post('/users/signup').send(fakeUser);
    expect(user.status).toBe(200);
    expect(user.body.token).toBeDefined();

  });

  it('should not be able to sign up new users with exsiting username', async()=>{
    let user = await mockRequest.post('/users/signup').send(fakeUser);
    expect(user.status).toBe(200);
    expect(user.body.token).toBeDefined();
    let anotherUser = await mockRequest.post('/users/signup').send(fakeUser);
    expect(anotherUser.status).toBe(403);
  });

  it('should allow existing user to sign in with correct username and password', async()=>{
    let signinUser = await mockRequest.post('/users/signin').auth('user', 'password');
    expect(signinUser.status).toBe(200);
    expect(signinUser.body.token).toBeDefined();
  });

  it('should block existing user to sign in with bad  password', async()=>{
    let signinUser = await mockRequest.post('/users/signin').auth('user', 'badpass');
    expect(signinUser.status).toBe(401);
    expect(signinUser.text).toBe('Invalid User ID/Password');
  });

  it('tests for signup route with bad user info', async ()=>{
    const result_1 = await mockRequest.post('/users/signup').send({});
    expect(result_1.status).toBe(403);
    expect(result_1.text).toBe('username, password and role are all required when registering a new user, please try again');

    const badUserObj = {
      username: 'janedoe',
      password: 'password',
    };
    const result_2 = await mockRequest.post('/users/signup').send(badUserObj);
    expect(result_2.status).toBe(403);
    expect(result_2.text).toBe('username, password and role are all required when registering a new user, please try again');
  });

});

describe('products API', () => {

  it('can post() a new product', async () => {
    let obj = createProduct();
    let result = await mockRequest.post('/api/products').send(obj).auth(adminToken, { type: 'bearer' });
    Object.keys(obj).forEach(key => {
      expect(result.body[key]).toEqual(obj[key]);
    });

  });

  it('can get() a product', async() => {
    let obj = createProduct();
    let getAfter = await mockRequest.get('/api/products').auth(adminToken, { type: 'bearer' });
    Object.keys(obj).forEach(key => {
      expect(getAfter.body[0][key]).toEqual(obj[key]);
    });
  });

  it('can get() a product by id', async() =>{
    let getProduct = await mockRequest.get(`/api/products/${productID}`).auth(userToken, { type: 'bearer' });
    expect(getProduct.body[0].name).toBe('apples');
  });

  it('Can update() a product by id', async() =>{
    let obj1 = createProduct();
    obj1.name = 'bananas';
    await mockRequest.put(`/api/products/${productID}`).send(obj1).auth(adminToken, { type: 'bearer' });
    let testAfterUpdate = await mockRequest.get(`/api/products/${productID}`).auth(userToken, { type: 'bearer' });
    expect(testAfterUpdate.body[0].name).toBe('bananas');
  });

  it('Can delete() a product by id', async() =>{

    await mockRequest.delete(`/api/products/${productID}`).send().auth(adminToken, { type: 'bearer' });
    let testAfterDelete = await mockRequest.get(`/api/products/${productID}`).auth(userToken, { type: 'bearer' });
    expect(testAfterDelete.body).toStrictEqual([]);
  });
});


describe('categories API ', () => {

  it('can post() a new category', async () => {
    let obj = createCategories();
    let result = await mockRequest.post('/api/categories').send(obj).auth(adminToken, { type: 'bearer' });
    Object.keys(obj).forEach(key => {
      expect(result.body[key]).toEqual(obj[key]);
    });
  });

  it('can get() a categories', async() => {
    let obj = createCategories();
    let getAfter = await mockRequest.get('/api/categories').auth(userToken, { type: 'bearer' });
    Object.keys(obj).forEach(key => {
      expect(getAfter.body[0][key]).toEqual(obj[key]);
    });
  });

  it('can get() a categories by id', async() =>{
    let getAfter = await mockRequest.get(`/api/categories/${categoryID}`).auth(userToken, { type: 'bearer' });
    expect(getAfter.body[0].name).toBe('fruit');
  });

  it('Can update() a categories by id', async() =>{

    let obj2 = createCategories();
    obj2.name = 'vegi';
    await mockRequest.put(`/api/categories/${categoryID}`).send(obj2).auth(adminToken, { type: 'bearer' });
    let testAfterUpdate = await mockRequest.get(`/api/categories/${categoryID}`).auth(userToken, { type: 'bearer' });
    expect(testAfterUpdate.body[0].name).toBe('vegi');
  });


  it('Can delete() a categories by id', async() =>{

    await mockRequest.delete(`/api/categories/${categoryID}`).auth(adminToken, { type: 'bearer' });
    let testAfterDelete = await mockRequest.get(`/api/categories/${categoryID}`).auth(userToken, { type: 'bearer' });
    expect(testAfterDelete.body.length).toBe(0);
  });

});

describe('test for bad routes', ()=>{
  it('test for bad routes', async()=>{
    let result = await mockRequest.get('/badRoute');
    expect(result.status).toBe(404);
    expect(result.text).toBe('The web resource you requested does not exsit');
  });
});
