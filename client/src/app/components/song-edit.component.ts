import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { SongService } from '../services/song.services';
import { ArtistService } from '../services/artist.services';
import { AlbumService } from '../services/album.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';
import { UploadService } from '../services/upload.services'

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService, AlbumService, UploadService, SongService]
})

export class SongEditComponent implements OnInit{
	public titulo:string;
	public artist:Artist;
	public album:Album;
	public song:Song;
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
		private _uploadService: UploadService,
		private _songService: SongService
	){
		this.titulo = 'Editar canción';
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');
		this.is_edit = true;
	}
	ngOnInit(){
		console.log('Add album');
		//Conseguir el album
		this.getSong();
	}	
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._songService.editSong(this.token, id, this.song).subscribe(
				response => {
					if(!response.song){
						this.alertMessage = "Error en el servidor";
					}else{
						this.alertMessage = "Éxito al actualizar la canción";
						//Subir Imagen
						if(!this.filesToUpload){
							console.log(this.song.album);
						}else{
							this._uploadService.makeFileRequest(this.url+'uploadFileSong/'+id,[],this.filesToUpload, this.token, 'songFile')
								.then(
									(result)=>{
										this._router.navigate(['/album', response.song.album]);
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
	getSong(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._songService.getSong(this.token, id).subscribe(
				response => {
					if(!response.song){
						this._router.navigate(['/']);
					}else{
						this.song = response.song;
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