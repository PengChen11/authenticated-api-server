'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const User = require('../src/model/userModel');

afterEach(async () => {
  await User.deleteMany({});
});

const fakeUser = {
  username: 'janedoe',
  password: 'password',
  role: 'admin',
  email: 'jane@doe.com',
};

it('should save hashed password', async () => {
  const user = await new User(fakeUser).save();
  expect(user.username).toBe(fakeUser.username);
  expect(user.password).not.toBe(fakeUser.password);
});

it('should authenticate known user', async () => {
  const newUser = await new User(fakeUser).save();
  const authenticatedUser = await User.authenticateBasic(fakeUser.username, fakeUser.password );
  expect(authenticatedUser).toBeDefined();
});

it('should get null for  unknown user', async () => {
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown' );
  expect(authenticatedUser).toBeNull();
});

it('should return user when password good', async () => {
  const user = await new User(fakeUser).save();
  const comparedUser = await user.comparePassword(fakeUser.password);
  expect(user).toBe(comparedUser);
});

it('should return null when password bad', async () => {
  const user = await new User(fakeUser).save();
  const comparedUser = await user.comparePassword('wrongpassword');
  expect(comparedUser).toBeNull();
});

it('should generate a token', async () => {
  const user = await new User(fakeUser).save();
  const token = user.tokenGenerator();
  expect(token).toBeDefined();
  const verifiedToken = jwt.verify(token, process.env.SECRET);
  expect(verifiedToken.role).toBe(user.role);
});

it('creating an existing user returns user', async () => {

  const user = await new User(fakeUser).save();

  const foundOrCreated = await User.createFromOauth(user.email);

  expect(foundOrCreated.email).toBe(user.email);
  expect(foundOrCreated.password).toBe(user.password);

});

it('creating with email returns new user', async () => {

  const foundOrCreated = await User.createFromOauth('new@new.com');

  expect(foundOrCreated.email).toBe('new@new.com');

  expect(foundOrCreated.password).not.toBe('none');

});

it('creating with missing email is an error', async () => {

  expect.assertions(1);

  await expect(User.createFromOauth()).rejects.toEqual('Validation Error');

});

it('should fail to authenticate used token', async () => {

  if (process.env.SINGLE_USE_TOKENS) {

    expect.assertions(1);

    const user = await User.create(fakeUser);

    const token = user.tokenGenerator();

    await User.authenticateToken(token);

    await expect(User.authenticateToken(token)).rejects.toEqual('Invalid Token');
  }

});

it('should seperate user capabilities based on role', async()=>{
  const testUser = fakeUser;
  testUser['role']= 'editor';
  const editor = await new User(testUser).save();
  let capabilities = Array.from(editor.capabilities);
  expect(capabilities).toStrictEqual(['create', 'read', 'update']);

  testUser['role']= 'writer';
  testUser.username = 'writer';
  const writer = await new User(testUser).save();
  capabilities = Array.from(writer.capabilities);
  expect(capabilities).toStrictEqual(['create', 'read']);

  testUser['role']= 'user';
  testUser.username = 'user';
  const user = await new User(testUser).save();
  capabilities = Array.from(user.capabilities);
  expect(capabilities).toStrictEqual(['read']);
});


