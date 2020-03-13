
const express = require('express');
const todoController = require('../controllers/todoController')
const config = require('../../config/appConfig')
const auth = require('../middleware/authorization')

function route(app) {

    let baseUrl = config.apiVersion + '/todo'

    app.get(baseUrl + '/view/all', auth.authorizationMiddleware, todoController.getAllTodo)

    app.get(baseUrl + '/:todoId/view', auth.authorizationMiddleware, todoController.getPerticularTodo)

    app.post(baseUrl + '/:todoId/deleteTodo', auth.authorizationMiddleware, todoController.deleteTodo)

    app.post(baseUrl + '/create', auth.authorizationMiddleware, todoController.createTodo)

    app.put(baseUrl + '/:todoId/edit', auth.authorizationMiddleware, todoController.editTodo)

}

module.exports = {
    router: route
}