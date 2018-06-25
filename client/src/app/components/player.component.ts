import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Song } from '../models/song';
import { SongService } from '../services/song.services';
import { UserService } from '../services/user.services';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'player',
	template: `
	<div class="album-image">
		<span *ngIf="song.album">
			<img id="play-image-album" src="{{url + 'getImageAlbum/'+ song.album.image}}" />
		</span>
		<span *ngIf="!song.album">
			<img id="play-image-album" src="assets/image/giphy.gif"/>
		</span>
	</div>
	<div class="audio-file">
		<p><strong>Reproduciendo</strong></p>
		<span id="play-song-file">
			{{song.name}}
		</span>

		<span id="play-song-artist">
			<span *ngIf="song.album.artist">
				{{song.album.artist.name}}
			</span>
		</span>
		<audio controls id="player">
			<source id="mp3-source" src="{{url+'getSongFile/'+song.file}}" type="audio/mpeg">
			Tu navegador no es compatible
		</audio>

	</div>
	`,
	providers: [UserService, SongService]
})

export class PlayerComponent implements OnInit{
	public identity;
	public token;
	public url:string;
	public alertMessage;
	public song:Song;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService
	){
		this.identity = _userService.getIdentity();
		this.token = _userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');
	}
	ngOnInit(){
		console.log('Player cargado');
		
		var song = JSON.parse(localStorage.getItem('sound_song'));
		if(song){
			this.song = song;
		}else{
			this.song = new Song(1,'','','','');
		}
	}	
	
}