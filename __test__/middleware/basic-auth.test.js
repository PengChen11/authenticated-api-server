'use strict';

require('@code-fellows/supergoose');
const { Error } = require('mongoose');
const auth = require('../../src/middleware/basicAuth');
const Users = require('../../src/model/userModel');

beforeAll(async (done) => {
  await new Users({username: 'admin', password: 'password', role: 'admin', email:'admin@admin.com'}).save();
  done();
});

describe('tests for basic auth', () => {

  let errorObject = {'message_spec': 'Invalid User ID/Password', 'statusCode': 401, 'statusMessage': 'Unauthorized'};


  it('fails a login for a user (admin) with the incorrect basic credentials or no credentials', async () => {

    let req = {
      headers: {
        authorization: 'Basic YWRtaW46Zm9v',
      },
    };
    let badReq = {
      headers: {},
    };
    let res = {};
    let next = jest.fn();
    await auth(req, res, next);
    expect(next).toHaveBeenCalledWith(errorObject);
    await auth(badReq,res,next);
    expect(next).toHaveBeenCalledWith(errorObject);
  });

  it('logs in an admin user with the right credentials', async () => {
    let req = {
      headers: {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      },
    };
    let res = {};
    let next = jest.fn();
    await auth(req,res,next);
    expect(next).toHaveBeenCalledWith();
  });

  it('shoud be able to catch non basic auth coded info error', async()=>{
    let req = {
      headers: {
        authorization: 'asfsxzcivjwioejfwei.sdaoi13i4342524k.dfwf',
      },
    };

    let res = {};
    let next = jest.fn();
    await auth(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.anything());
  });
});
