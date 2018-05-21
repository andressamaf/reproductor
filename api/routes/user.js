'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middleware/authenticated');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/UserController',md_auth.ensureAuth, UserController.prueba);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/updateUser/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/uploadImageUser/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/getImageUser/:imageFile', UserController.getImageFile);
module.exports = api;