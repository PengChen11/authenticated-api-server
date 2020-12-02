'use strict';

function handlerGenerator (method){
  return async (req, res, next)=>{
    const id = req.params.id ? {_id:req.params.id } : {};
    const assignee = req.params.assignee ? {assignee:req.params.assignee} : {};
    if (!req.model) {
      next();
      return;
    }

    try{
      let result;
      switch(method){
      case 'find':
        result = await req.model.find(id);
        break;
      case 'findUser':
        result = await req.model.find(assignee);
        break;
      case 'new':
        result = await new req.model(req.body).save();
        break;
      case 'update':
        result = await req.model.findByIdAndUpdate(id, req.body, {new:true});
        break;
      case 'delete':
        result = await req.model.findByIdAndDelete(id);
      }
      res.json(result);
    }
    catch (err){
      next(err);
    }
  };
}

const getAll = handlerGenerator('find');
const getOne = handlerGenerator('find');
const getAllByUser = handlerGenerator('findUser');
const createOne = handlerGenerator('new');
const updateOne = handlerGenerator('update');
const deleteOne = handlerGenerator('delete');


module.exports = {getAll, getOne, getAllByUser, createOne, updateOne, deleteOne};
