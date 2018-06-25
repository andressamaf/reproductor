import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { ArtistService } from '../services/artist.services';
import { AlbumService } from '../services/album.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';
import { UploadService } from '../services/upload.services'
@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
	public titulo:string;
	public artist:Artist;
	public album:Album;
	public identity;
	public token;
	public url:string;
	public alertMessage;
	public is_edit;
	public filesToUpload;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _uploadService: UploadService
	){
		this.titulo = 'Editar álbum';
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',2017,'','');
		this.is_edit = true;	
	}
	ngOnInit(){
		console.log('Add album');
		//Conseguir el album
		this.getAlbum();
	}	
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._albumService.editAlbum(this.token, id, this.album).subscribe(
				response => {
					if(!response.album){
						this.alertMessage = "Error en el servidor";
					}else{
						this.alertMessage = "Éxito al actualizar el album";
						//Subir Imagen
						if(!this.filesToUpload){
							console.log(this.album.artist);
						}else{
							this._uploadService.makeFileRequest(this.url+'uploadImageAlbum/'+id,[],this.filesToUpload, this.token, 'image')
								.then(
									(result)=>{
										this._router.navigate(['/artista', response.album.artist]);
									},
									(error)=>{
										console.log(error)
									}
							);
						}
						
					}
					
				},
				error => {
					var errorMessage = <any>error;
		  			if(errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				this.alertMessage = body.message;
		  				console.log(error)
		  			}
				}
			)
		})
	}
	getAlbum(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					if(!response.album){
						this._router.navigate(['/']);
					}else{
						this.album = response.album;
					}
					
				},
				error => {
					var errorMessage = <any>error;
		  			if(errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				console.log(error)
		  			}
				}
			)
		})
	}
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload)
	}
}