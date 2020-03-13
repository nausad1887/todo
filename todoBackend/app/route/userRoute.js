
const express = require('express');
const userController = require('../controllers/usersController')
const config = require('../../config/appConfig')
const auth = require('../middleware/authorization')

function route(app) {
  let baseUrl = config.apiVersion + '/user'


  app.post(baseUrl + '/signup', userController.signUp)

  app.post(baseUrl + '/sign-in', userController.signIn)

  app.post(baseUrl + '/logout', auth.authorizationMiddleware, userController.logout)

  app.post(baseUrl + '/:userId/deleteUser', auth.authorizationMiddleware, userController.deleteUser)

  app.get(baseUrl + '/view/all', auth.authorizationMiddleware, userController.getAllUsers)

  app.get(baseUrl + '/view/:userId', auth.authorizationMiddleware, userController.getPerticularUser)

  app.put(baseUrl + '/:userId/edit', auth.authorizationMiddleware, userController.editUser)


}

module.exports = {
  router: route
}