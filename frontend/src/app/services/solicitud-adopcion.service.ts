import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CrearSolicitudAdopcion {
  id_adopcion: number;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudAdopcionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  crear(datos: CrearSolicitudAdopcion): Observable<{ id_solicitud: number; id_adopcion: number; estado: string }> {
    return this.http.post<{ id_solicitud: number; id_adopcion: number; estado: string }>(this.apiUrl, datos);
  }
}