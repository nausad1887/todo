const express = require('express')
//this module used for using mongoose functionality for CRUD operation like-find(), findOne(), save(), deleteOne(), update() and etc..
const mongoose = require('mongoose')
//this module for schema definition
require('../model/userModel')
require('../model/socketModel')
require('../model/authModel')
//this module used for creating short id
const shortid = require('shortid');
const response = require('../library/responseLib')
const logger = require('../library/loggerLib')
const validator = require('../library/validatorLib')
const nodemailer = require('nodemailer');
var moment = require('moment');
const checkLib = require('../library/checkLib')
const generateToken = require('../library/tokenLib')
//defining models
const chatModel = mongoose.model('chatModel')
const user = mongoose.model('users')
const auth = mongoose.model('Auth')

const passwordHash = require('../library/passwordLib')


let signUp = (req, res) => {

    user.findOne({ 'email': req.body.email })
        .exec((err, retrivedUserDetails) => {
            if (err) {
                console.log(err)
                logger.error('Some error occured', 'appController : signUpFunction', 10)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(retrivedUserDetails)) {
                console.log(req.body)
                let newUser = new user({
                    userId: shortid.generate(),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: validator.Email(req.body.email),
                    password: validator.Password(req.body.password),
                    mobileNumber: req.body.mobileNumber,
                    apiKey:req.body.apiKey,
                    createdOn: Date.now()
                })
                console.log(newUser)
                if (checkLib.isEmpty(req.body.email) === true && checkLib.isEmpty(req.body.password) === true) {
                    let apiResponse = response.generateRes(true, 'Email and Password cannot be empty', 403, null)
                    res.send(apiResponse)
                } else if (checkLib.isEmpty(req.body.email) === true) {
                    let apiResponse = response.generateRes(true, 'Email cannot be empty', 403, null)
                    res.send(apiResponse)
                } else if (checkLib.isEmpty(req.body.password) === true) {
                    let apiResponse = response.generateRes(true, 'Password cannot be empty', 403, null)
                    res.send(apiResponse)
                } else if (newUser.password === 'false') {
                    let apiResponse = response.generateRes(true, 'Passwords must contains min 8 characters with including symbols, numbers, upperCase and a lowerCase', 403, null)
                    res.send(apiResponse)
                } else if (newUser.email === 'false') {
                    let apiResponse = response.generateRes(true, 'Email must be valid', 400, null)
                    res.send(apiResponse)
                } else {
                    newUser.email = req.body.email.toLowerCase()
                    newUser.password = passwordHash.generateHash(req.body.password)
                    newUser.save((err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error('some error occured', 'appController : signUpFunction', 10)
                            let apiResponse = response.generateRes(true, 'some internal error occured while sign up', 500, null)
                            res.send(apiResponse)
                        } else {
                            let user = result.toObject();
                            delete user._id
                            delete user.__v
                            let apiResponse = response.generateRes(false, 'Sign-Up successfully', 200, user)
                            res.send(apiResponse)
                            
                        }
                    })
                }
            } else {
                logger.error('User Cannot Be Created.User Already Present', 'appController : signup', 4)
                let apiResponse = response.generateRes(true, 'User Already Present With this Email', 403, null)
                res.send(apiResponse)

            }

        })
        

}//end of signUp function

let signIn = (req, res) => {

    let userLogin = () => {
        console.log('findUser')
        return new Promise((resolve, reject) => {
            user.findOne({ 'email': req.body.email }, (err, result) => {
                if (err) {
                    console.log(err)
                    logger.error('some error occured', 'appController : log-in', 10)
                    apiResponse = response.generateRes(true, 'some internal error occured while login', 500, null)
                    reject(apiResponse)
                } else if (checkLib.isEmpty(req.body.email) === true && checkLib.isEmpty(req.body.password) === true) {
                    console.log('Email and Password cannot be empty')
                    let apiResponse = response.generateRes(true, 'Email and Password cannot be empty', 500, null)
                    reject(apiResponse)
                } else if (checkLib.isEmpty(req.body.password) === true) {
                    console.log('Password cannot be empty')
                    let apiResponse = response.generateRes(true, 'Password cannot be empty', 500, null)
                    reject(apiResponse)
                } else if (checkLib.isEmpty(result)) {
                    console.log('No user found in this email')
                    let apiResponse = response.generateRes(true, 'No user found in this email', 500, null)
                    reject(apiResponse)
                } else {
                    let validatePassword = passwordHash.comparePassword(req.body.password, result.password)
                    if (validatePassword === true) {
                        logger.info('Password is validated', 'appController : login', 0)
                        let retrivedUserDetails = result.toObject()
                        delete retrivedUserDetails.__v
                        delete retrivedUserDetails._id
                        delete retrivedUserDetails.password
                        delete retrivedUserDetails.createdOn

                        generateToken.generateToken(retrivedUserDetails, (err, data) => {
                            if (err) {
                                logger.error('Error while generating jwt token', 'library : tokenLib', 10)
                                let apiResponse = response.generateRes(true, 'Error while generating jwt token', 500, null)
                                reject(apiResponse)
                            } else {

                                let token = {}
                                token.token = data.token
                                token.userId = retrivedUserDetails.userId
                                token.userDetails = retrivedUserDetails
                                token.secretKey = data.secretKey
                                console.log(retrivedUserDetails)
                                resolve(token)
                            }
                        })


                    } else {
                        console.log('Password cannot match')
                        let apiResponse = response.generateRes(true, 'Password cannot match', 500, null)
                        reject(apiResponse)
                    }
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            auth.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error('some error occured', 'userController: saveToken', 10)
                    let apiResponse = response.generateRes(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (checkLib.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new auth({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        secretKey: tokenDetails.secretKey,
                        createdOn: moment.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error('some error occured', 'userController: saveToken', 10)
                            let apiResponse = response.generateRes(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.secretKey = tokenDetails.secretKey
                    retrievedTokenDetails.tokenGenerationTime = moment.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error('some error occured', 'userController: saveToken', 10)
                            let apiResponse = response.generateRes(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    userLogin(req, res)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generateRes(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


}//end of signIn function

let getAllUsers = (req, res) => {

    user.find()
        .lean()
        .select('-__v -_id -password')
        .exec((err, result) => {
            if (err) {
                logger.error('Some error occured', 'userController : getAllUsers', 8)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(result)) {
                logger.error('empty data', 'userController : getAllUsers', 5)
                let apiResponse = response.generateRes(true, 'no users are found', 403, null)
                res.send(apiResponse)
            } else {
                logger.info('data found successfully', 'userController : getAllUsers', 0)
                let apiResponse = response.generateRes(false, 'Users found successfully', 200, result)
                res.send(apiResponse)
            }
        })

}//end of getAllUsers Function

let logout = (req, res) => {
    auth.deleteOne({ 'userId': req.user.userId }, (err, result) => {
        if (err) {
            logger.error(err.message, 'appController : logout', 5)
            let apiResponse = response.generateRes(true, 'Error in logging out', 403, null)
            res.send(apiResponse)

        } else if (checkLib.isEmpty(result)) {
            logger.error(err.message, 'appController : logout', 3)
            let apiResponse = response.generateRes(true, 'Some Error Occured', 500, null)
            res.send(apiResponse)
        } else {
            logger.info('User logout successfully', 'appController: logout', 200)
            let apiResponse = response.generateRes(false, 'User Logout successfully', 200, null)
            res.send(apiResponse)
        }

    })
}


let getPerticularUser = (req, res) => {

    user.findOne({ 'userId': req.params.userId })
        .select('-password')
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error('Some error occured', 'userController : getPerticularUser', 8)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(result)) {
                logger.error('user not found', 'userController : getPerticularUser', 8)
                let apiResponse = response.generateRes(true, 'No user found', 403, null)
                res.send(apiResponse)
            } else {
                logger.error('User found successfully', 'userController : getPerticularUser', 0)
                let apiResponse = response.generateRes(false, 'User Found Successfully', 200, result)
                res.send(apiResponse)
            }
        })



}//end of getPerticularUser Function

let editUser = (req, res) => {

    let options = req.body;
    user.update({ 'userId': req.params.userId }, options)
        .select('-password')
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error('Some error occured', 'userController : editUser', 8)
                let apiResponse = response.generateRes(true, 'some internal error occured', 500, null)
                res.send(apiResponse)
            } else if (checkLib.isEmpty(result)) {

                logger.error('cannot find data', 'userController : editUser', 5)
                let apiResponse = response.generateRes(true, 'No user is found', 500, null)
                res.send(apiResponse)
            } else {

                logger.error('user edited successfully', 'userController : editUser', 0)
                let apiResponse = response.generateRes(false, 'User edited successfully', 200, null)
                res.send(apiResponse)
            }
        })

}//end of edit function

let deleteUser = (req, res) => {

    user.deleteOne({ 'userId': req.params.userId }, (err, result) => {
        if (err) {
            logger.error('some error occured', 'userController : deleteUser', 10)
            let apiResponse = response.generateRes(true, 'some error occured while deleting user', 500, null)
            res.send(apiResponse)
        } else if (checkLib.isEmpty(result)) {
            logger.error('user cannot found', 'userController : deleteUser', 5)
            let apiResponse = response.generateRes(true, 'user cannot found in the data-base', 403, null)
            res.send(apiResponse)
        } else {
            logger.error('user deleted successfully', 'userController : deleteUser', 0)
            let apiResponse = response.generateRes(false, 'User deleted successfully', 200, null)
            res.send(apiResponse)
        }
    })

}//end of delete user function

module.exports = {
    signUp: signUp,
    signIn: signIn,
    getAllUsers: getAllUsers,
    getPerticularUser: getPerticularUser,
    editUser: editUser,
    deleteUser: deleteUser,
    logout:logout
}

