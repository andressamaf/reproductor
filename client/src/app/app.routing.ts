import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user components
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';

//import artist components
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-show.component';

//import album components
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//Song components
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

//Player component
import { PlayerComponent } from './components/player.component';

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'editar-cancion/:id', component: SongEditComponent},
	{path: 'crear-cancion/:album', component: SongAddComponent},
	{path: 'crear-album/:artist', component: AlbumAddComponent},
	{path: 'editar-album/:id', component: AlbumEditComponent},
	{path: 'album/:id', component: AlbumDetailComponent},
	{path: 'artistas/:page', component: ArtistListComponent},
	{path: 'crear-artista', component: ArtistAddComponent},
	{path: 'editar-artista/:id', component: ArtistEditComponent},
	{path: 'artista/:id', component: ArtistDetailComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: '**', component: HomeComponent}
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);