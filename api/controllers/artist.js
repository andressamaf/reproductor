'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
 	var artistId = req.params.id;
 	Artist.findById(artistId, (err, artist)=>{
 		if(err){
 			res.status(500).send({message:"Error en la peticion de artista"});		
 		}else{
 			if(!artist){
 				res.status(404).send({message:"El artista no existe"});
 			}else{
 				res.status(200).send({artist});
 			}
 		}
 	})
} 
function saveArtist(req, res){
	var artist = new Artist;

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStorage) => {
		if(err){
			res.status(500).send({message: "Error al guardar el artista"});
		}else{
			if(!artistStorage){
				res.status(404).send({message: "El artista no ha sido guardado"});
			}else{
				res.status(200).send({artist: artistStorage});
			}
		}
	});
}
function getArtists(req, res) {
	if (req.params.page){
		var page = req.params.page;	
	} 
	else {
		var page = 1;	
	} 
	var itemsPerPage = 3;
	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
		if(err){
			res.status(500).send({message: "Error al listar artistas"});
		}else{
			if(!artists){
				res.status(404).send({message: "El artista no ha sido guardado"});
			}else{
				return res.status(200).send({
					pages: total,
					artists: artists
				});	
			}
		}
	})
}
function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
		if(err){
			res.status(500).send({message: "Error al actualizar el artista"});
		}else{
			if(!artistUpdated){
				req.status.send({message: "El artista no ha sido actaulizado"});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	})
}
function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
		if(err){
			res.status(500).send({message: "Error al borrar el artista"});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: "El artista no ha sido eliminado"});
			}else{
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
					if(err){
						res.status(500).send({message: "Error al borrar el album"});
					}else{
						if(!albumRemoved){
							res.status(404).send({message: "El album no ha sido eliminado"});
						}else{ 
							Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
								if(err){
									res.status(500).send({message: "Error al borrar la cancion"});
								}else{
									if(!songRemoved){
										res.status(404).send({message: "La cancion no ha sido eliminada"});
									}else{ 
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}
function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		
		if(file_ext == "png" || file_ext == "jpg" || file_ext == "gif"){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) =>{
				if(!artistUpdated){
					res.status(404).send({message: "No se ha podido actualizar el artista"});
				}else{
					res.status(200).send({artist: artistUpdated});
				}		
			})
		}else{
			res.status(200).send({message: "Extension de archivo no valida"})
		}
	}else{
		res.status(200).send({message: "No has subido ninguna imagen"});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artist/'+imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({message: "No existe imagen"});
		}
	})
}
module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	getImageFile,
	uploadImage
};