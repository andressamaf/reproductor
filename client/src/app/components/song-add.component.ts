import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Song } from '../models/song';
import { UserService } from '../services/user.services';
import { SongService } from '../services/song.services';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
	public titulo:string;
	public song:Song;
	public identity;
	public token;
	public url:string;
	public alertMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService
	){
		this.titulo = 'Crear nueva canción';
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');
	}
	ngOnInit(){
		console.log('Add album');
		//Conseguir el artista
		
	}
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
			let album_id = params['album'];
			this.song.album = album_id;
			console.log(this.song);
			this._songService.addSong(this.token, this.song).subscribe(
				response => {
					if(!response.song){
						this.alertMessage = "Error en el servidor";
					}else{
						this.alertMessage = "Éxito al crear la canción";
						this.song = response.song;
						this._router.navigate(['/editar-cancion', response.song._id]);
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