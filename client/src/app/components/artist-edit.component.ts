import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Artist } from '../models/artist'
import { ArtistService } from '../services/artist.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';
import { UploadService } from '../services/upload.services'
@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
	public titulo:string;
	public artist:Artist;
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
		private _artistService: ArtistService,
		private _uploadService: UploadService
	){
		this.titulo = 'Actualizar artista';
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('','','');
		this.is_edit = true;
	}
	ngOnInit(){
		console.log('Artista edit');
		//Conseguir el artista
		this.getArtist();
	}
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
		let id = params['id'];
			this._artistService.editArtist(this.token, this.artist, id).subscribe(
				response => {
					if(!response.artist){
						this.alertMessage = "Error en el servidor";
					}else{
						this.alertMessage = "Éxito al actualizar el artista";
						this.artist = response.artist;
						//Subir imagen
						if(!this.filesToUpload){
							this._router.navigate(['/artista',id]);
						}else{
							this._uploadService.makeFileRequest(this.url+'uploadImageArtist/'+id,[],this.filesToUpload, this.token, 'image')
								.then(
									(result)=>{
										this._router.navigate(['/artista',id]);
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
		});
	}
	getArtist(){
		this._route.params.forEach((params: Params)=>{
			let id = params['id'];
			this._artistService.getArtist(this.token, id).subscribe(
				response => {
					if(!response.artist){
						this._router.navigate(['/']);
					}else{
						this.artist = response.artist;	
					}
				},
				error => {
					var errorMessage = <any>error;
		  			if(errorMessage != null){
		  				var body = JSON.parse(error._body);
		  				//this.alertMessage = body.message;
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