import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Artist } from '../models/artist'
import { Album } from '../models/album'
import { ArtistService } from '../services/artist.services';
import { AlbumService } from '../services/album.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
	public artist:Artist;
	public albums:Album[];
	public identity;
	public token;
	public url:string;
	public alertMessage;
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService
	){
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('','','');
	}
	ngOnInit(){
		console.log('Artista edit');
		//Conseguir el artista
		this.getArtist();
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

						//Sacar datos de los albums del artista
						this._albumService.getAlbums(this.token, response.artist._id).subscribe(
							response => {
								if(!response.albums){
									this.alertMessage = "Este artista no tiene álbums";
								}else{
									this.albums = response.albums;
									console.log(this.albums);
								}
							},error => {
								var errorMessage = <any>error;
					  			if(errorMessage != null){
					  				var body = JSON.parse(error._body);
					  				this.alertMessage = body.message;
					  				console.log(error);
				  				}
							}
						)
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
	onDeleteConfirm(id){
		this.confirmado = id; 
	}
	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token, id).subscribe(
			response => {
				if(!response.album){
					alert('Error en el servidor');
				}else{
					this.getArtist();
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
	}
	onCancelAlbum(){
		this.confirmado = null;
	}
}