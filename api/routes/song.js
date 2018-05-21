'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/song'});

var md_auth = require('../middleware/authenticated');

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/uploadFileSong/:id',[md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/getSongFile/:songFile', SongController.getSongFile);
module.exports = api;