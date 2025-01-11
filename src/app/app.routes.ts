import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShareComponent } from './pages/share/share.component';

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
    path: '**',
    redirectTo: ''
  }
];
