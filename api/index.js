'use strict'

var mongoose =  require("mongoose");
var app = require('./app');
var port = process.env.PORT || 3570
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res) =>{
	if(err){
		throw err;
	}else{
		console.log("La base de datos se conecta correctamente");
		app.listen(port, function(){
			console.log("Servidor del api rest de musica esta escuchando en http://localhost:"+port);
		})
	}
});
