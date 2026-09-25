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
      if (filtros.tamano) params = params.set('tamano', filtros.tamano);
      if (filtros.radioKm) params = params.set('radio', filtros.radioKm.toString());
      if (filtros.lat && filtros.lng) {
        params = params.set('lat', filtros.lat.toString());
        params = params.set('lng', filtros.lng.toString());
      }
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