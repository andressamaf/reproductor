'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/album'});

var md_auth = require('../middleware/authenticated');

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/uploadImageAlbum/:id',[md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/getImageAlbum/:imageFile', AlbumController.getImageFile);
module.exports = api;