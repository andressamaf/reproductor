import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { ArtistService } from '../services/artist.services';
import { AlbumService } from '../services/album.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
	public titulo:string;
	public artist:Artist;
	public album:Album;
	public identity;
	public token;
	public url:string;
	public alertMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService,
	){
		this.titulo = 'Creación de álbum';
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',2017,'','');
	}
	ngOnInit(){
		console.log('Add album');
		//Conseguir el artista
		
	}
	onSubmit(){
		
		this._route.params.forEach((params: Params)=>{
			let artist_id = params['artist'];
			this.album.artist = artist_id;
			console.log(this.album);
			this._albumService.addAlbum(this.token, this.album).subscribe(
				response => {
					if(!response.album){
						this.alertMessage = "Error en el servidor";
					}else{
						this.alertMessage = "Éxito al crear el album";
						this.album = response.album;
						this._router.navigate(['/editar-album', response.album._id]);
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

}