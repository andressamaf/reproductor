'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var user_route = require('./routes/user');
var artist_route = require('./routes/artist');
var album_route = require('./routes/album');
var song_route = require('./routes/song');
//rutas

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configuracion de cabeceras
app.use((req, res, next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Header', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
})

//rutas base
app.use('/api', user_route);
app.use('/api', artist_route);
app.use('/api', album_route);
app.use('/api', song_route);

module.exports = app;