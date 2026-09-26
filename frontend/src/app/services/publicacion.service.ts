import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicacionAdopcion, FiltrosPublicacion } from '../models/publicacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/publicaciones`;

  getPublicaciones(filtros?: FiltrosPublicacion): Observable<PublicacionAdopcion[]> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.especie) params = params.set('especie', filtros.especie);
      if (filtros.rango_edad) params = params.set('rango_edad', filtros.rango_edad);
      if (filtros.pais) params = params.set('pais', filtros.pais);
      if (filtros.ciudad) params = params.set('ciudad', filtros.ciudad);
      if (filtros.estado) params = params.set('estado', filtros.estado);
    }

    return this.http.get<PublicacionAdopcion[]>(this.apiUrl, { params });
  }

  getPublicacionPorId(id: number): Observable<PublicacionAdopcion> {
    return this.http.get<PublicacionAdopcion>(`${this.apiUrl}/${id}`);
  }

  crearPublicacion(datos: FormData): Observable<PublicacionAdopcion> {
    return this.http.post<PublicacionAdopcion>(this.apiUrl, datos);
  }
}