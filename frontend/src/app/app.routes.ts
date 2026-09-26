import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { TestUpload } from './pages/test-upload/test-upload';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'publicaciones', component: Publicaciones },
    { path: 'test-upload', component: TestUpload },
];