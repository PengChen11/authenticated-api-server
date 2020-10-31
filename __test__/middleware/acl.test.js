
'use strict';
const acl = require('../../src/middleware/acl');
process.env.AUTH_SWITCH='on';
let res = {};

describe('ACL middleware tests', ()=>{

  it('should alow user to pass with correct permissions', ()=>{
    let req = {user:{capabilities:['read', 'write', 'update']}};
    let next = jest.fn();
    acl('read')(req,res,next);
    expect(next).toHaveBeenCalledWith();

    acl('write')(req,res,next);
    expect(next).toHaveBeenCalledWith();

    acl('update')(req,res,next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should NOT alow user to pass without correct permissions', ()=>{
    process.env.AUTH_SWITCH='on';
    let req = {user:{capabilities:['read']}};
    let next = jest.fn();
    acl('read')(req,res,next);
    expect(next).toHaveBeenCalledWith();

    acl('write')(req,res,next);
    expect(next).toHaveBeenCalledWith('Access Denied');

    acl('update')(req,res,next);
    expect(next).toHaveBeenCalledWith('Access Denied');
  });

  it ('should BLOCK user without login', ()=>{
    let req = {};
    let next = jest.fn();
    acl('read')(req,res,next);
    expect(next).toHaveBeenCalledWith('Invalid Login');
  });
});
