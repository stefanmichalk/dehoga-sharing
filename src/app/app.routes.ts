import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShareComponent } from './pages/share/share.component';
import { StaticComponent } from './pages/static/static.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'share/:id', 
    component: ShareComponent 
  },
  {
    path: 'page/:id',
    component: StaticComponent
  },
  {
    path: 'downloads',
    loadComponent: () => import('./pages/downloads/downloads.component').then(m => m.DownloadsComponent)
  },
  {
    path: 'social-media',
    loadComponent: () => import('./pages/social-media/social-media.component').then(m => m.SocialMediaComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
