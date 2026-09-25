import { Routes } from '@angular/router';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones';
import { PublicacionDetalle } from './pages/publicacion-detalle/publicacion-detalle';
import { PublicacionForm } from './pages/publicacion-form/publicacion-form';
import { LoginComponent } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { Reportes } from './pages/reportes/reportes';
import { ReporteDetalle } from './pages/reporte-detalle/reporte-detalle';
import { ReporteForm } from './pages/reporte-form/reporte-form';
import { Refugios } from './pages/refugios/refugios';
import { RefugioDetalle } from './pages/refugio-detalle/refugio-detalle';
import { RefugioForm } from './pages/refugio-form/refugio-form';
import { Guias } from './pages/guias/guias';
import { GuiaDetalle } from './pages/guia-detalle/guia-detalle';
import { GuiaForm } from './pages/guia-form/guia-form';
import { Donaciones } from './pages/donaciones/donaciones';
import { DonacionesAdmin } from './pages/donaciones-admin/donaciones-admin';

export const routes: Routes = [
  { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: Registro },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'about-us', redirectTo: 'nosotros', pathMatch: 'full' },
  { path: 'publicaciones', component: PublicacionesComponent },
  { path: 'publicaciones/nuevo', component: PublicacionForm },
  { path: 'publicaciones/:id', component: PublicacionDetalle },
  { path: 'reportes', component: Reportes },
  { path: 'reportes/nuevo', component: ReporteForm },
  { path: 'reportes/:id', component: ReporteDetalle },
  { path: 'refugios', component: Refugios },
  { path: 'refugios/nuevo', component: RefugioForm },
  { path: 'refugios/:id', component: RefugioDetalle },
  { path: 'guias', component: Guias },
  { path: 'guias/nuevo', component: GuiaForm },
  { path: 'guias/:id', component: GuiaDetalle },
  { path: 'donaciones', component: Donaciones },
  { path: 'admin/donaciones', component: DonacionesAdmin },
  { path: '**', redirectTo: 'publicaciones' }
];