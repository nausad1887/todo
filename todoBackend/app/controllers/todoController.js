const mongoose = require('mongoose')
const shortId = require('shortid')
require('../model/todoModel')
const response = require('../library/responseLib')
const checkLib = require('../library/checkLib')
const logger = require('../library/loggerLib')
const todo = mongoose.model('todoS')


'use strict';


let createTodo = (req, res) => {

    let todoId = shortId.generate()
    
    let newTodo = new todo({
        userId:req.user.userId,
        todoId: todoId,
        todo: req.body.todo,
        createdOn: Date.now()
    })

    newTodo.save((err, result) => {
        if (err) {
            logger.error('Some error occured', 'todoController : createTodo', 8)
            let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
            res.send(apiResponse)
        } else if (checkLib.isEmpty(result)) {
            logger.error('error while creating todo', 'todoController : createTodo', 5)
            let apiResponse = response.generateRes(true, 'error in creating todo', 403, null)
            res.send(apiResponse)
        } else {
            logger.info('todo created successfully', 'todoController : todoCreated', 0)
            let apiResponse = response.generateRes(false, 'todo created successfully', 200, result)
            res.send(apiResponse)
        }
    })
}





let getAllTodo = (req, res) => {

    todo.find({'userId': req.user.userId})
        .lean()
        .select('-__v -_id')
        .exec((err, result) => {
            if (err) {
                logger.error('Some error occured', 'todoController : getAllTodo', 8)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(result)) {
                logger.error('empty data', 'todoController : getAllTodo', 5)
                let apiResponse = response.generateRes(true, 'no todo-lists are found', 403, null)
                res.send(apiResponse)
            } else {
                logger.info('data found successfully', 'todoController : getAllTodo', 0)
                let apiResponse = response.generateRes(false, 'todo-lists found successfully', 200, result)
                res.send(apiResponse)
            }
        })

}//end of getAllUsers Function



let getPerticularTodo = (req, res) => {

    todo.findOne({ 'todoId': req.params.todoId })
        .select('-__v -_id')
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error('Some error occured', 'todoController : getPerticularTodo', 8)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(result)) {
                logger.error('todo not found', 'todoController : getPerticularTodo', 8)
                let apiResponse = response.generateRes(true, 'No todo found', 403, null)
                res.send(apiResponse)
            } else {
                logger.error('Todo found successfully', 'todoController : getPerticularTodo', 0)
                let apiResponse = response.generateRes(false, 'Todo Found Successfully', 200, result)
                res.send(apiResponse)
            }
        })



}//end of getPerticularUser Function

let editTodo = (req, res) => {

    options = req.body;

    todo.update({ 'todoId': req.params.todoId }, options, { multi: true })
    .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error('Some error occured', 'todoController : editTodo', 8)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(result)) {

                logger.error('cannot find todo', 'todoController : editTodo', 5)
                let apiResponse = response.generateRes(true, 'No todo is found', 500, null)
                res.send(apiResponse)
            } else {

                logger.error('todo edited successfully', 'todoController : editTodo', 0)
                let apiResponse = response.generateRes(false, 'todo edited successfully', 200, null)
                res.send(apiResponse)
            }
        })

}//end of edit function

let deleteTodo = (req, res) => {

    todo.deleteOne({ 'todoId': req.params.todoId }, (err, result) => {
        if (err) {
            logger.error('some error occured', 'todoController : deleteTodo', 10)
            let apiResponse = response.generateRes(true, 'some error occured while deleting todo', 500, null)
            res.send(apiResponse)
        } else if (checkLib.isEmpty(result)) {
            logger.error('todo cannot found', 'todoController : deleteTodo', 5)
            let apiResponse = response.generateRes(true, 'todo cannot found in the data-base', 403, null)
            res.send(apiResponse)
        } else {
            logger.error('todo deleted successfully', 'todoController : deleteTodo', 0)
            // let apiResponse = response.generateRes(false, 'Todo deleted successfully', 200, null)
            // res.send(apiResponse)
            todo.find({'userId': req.user.userId})
            .lean()
            .select('-__v -_id')
            .exec((err, result) => {
                if (err) {
                    logger.error('Some error occured', 'todoController : getAllTodo', 8)
                    let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                    res.send(apiResponse)
                } else if (checkLib.isEmpty(result)) {
                    logger.error('empty data', 'todoController : getAllTodo', 5)
                    let apiResponse = response.generateRes(true, 'no todo-lists are found', 403, null)
                    res.send(apiResponse)
                } else {
                    logger.info('data found successfully', 'todoController : getAllTodo', 0)
                    let apiResponse = response.generateRes(false, 'Todo deleted successfully', 200, result)
                    res.send(apiResponse)
                }
            })
        }
    })

}//end of delete user function



module.exports = {

    createTodo:createTodo,
    getAllTodo:getAllTodo,
    deleteTodo:deleteTodo,
    getPerticularTodo:getPerticularTodo,
    editTodo:editTodo
}