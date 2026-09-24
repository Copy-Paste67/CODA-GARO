import { Routes } from '@angular/router';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'publicaciones', component: PublicacionesComponent },
  { path: '**', redirectTo: 'publicaciones' }
];