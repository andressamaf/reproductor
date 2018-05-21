'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artist'});

var md_auth = require('../middleware/authenticated');

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/uploadImageArtist/:id',[md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/getImageArtist/:imageFile', ArtistController.getImageFile);
module.exports = api;