import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Artist } from '../models/artist'
import { ArtistService } from '../services/artist.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'crear-artista',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
	public titulo:string;
	public artist:Artist;
	public identity;
	public token;
	public url:string;
	public alertMessage;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService
	){
		this.titulo = 'Crear nuevo artista';
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('','','');
		
	}
	ngOnInit(){
		console.log('Artista add');
		//Conseguir listado de artistas
	}
	onSubmit(){
		console.log('Artista add');
		this._artistService.addArtist(this.token, this.artist).subscribe(
			response => {
				if(!response.artist){
					this.alertMessage = "Error en el servidor";
				}else{
					this.alertMessage = "Éxito al crear el artista";
					this.artist = response.artist;
					this._router.navigate(['/editar-artista', response.artist._id]);
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
	}
}