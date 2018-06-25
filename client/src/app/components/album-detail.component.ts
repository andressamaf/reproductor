import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Album } from '../models/album';
import { Song } from '../models/song';
import { SongService } from '../services/song.services';
import { AlbumService } from '../services/album.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
	public album:Album;
	public songs:Song[];
	public identity;
	public token;
	public url:string;
	public alertMessage;
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService
	){
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
	}
	ngOnInit(){
		console.log('Album detail');
		//Conseguir el album
		this.getAlbum();
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
						this._songService.getSongs(this.token, response.album._id).subscribe(
							response => {
								if(!response.songs){
									this.alertMessage ="Este álbum no tiene canciones";
								}else{
									this.songs = response.songs;
									 console.log(this.songs);
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
	onDeleteConfirm(id){
		this.confirmado = id;
	}
	onDeleteSong(id){
		this._songService.deleteSong(this.token, id).subscribe(
			response => {
				if(!response.song){
					alert('Error en el servidor')
				}else{
					this.getAlbum();
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
	}
	onCancelSong(){
		this.confirmado = null;
	}
	startPlayer(song){
		let songPlayer = JSON.stringify(song);
		let file_path = this.url+"getSongFile/"+song.file;
		let image_path = this.url+"getImageAlbum/"+song.album.image;
		console.log(song);
		localStorage.setItem('sound_song', songPlayer);
		document.getElementById('mp3-source').setAttribute('src', file_path);
		(document.getElementById('player') as any).load();
		(document.getElementById('player') as any).play();
		document.getElementById('play-song-file').innerHTML = song.name;
		document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
		document.getElementById('play-image-album').setAttribute('src', image_path);
	}
}