import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RefugioCrear {
    nombre_refugio: string;
    direccion: string;
    descripcion?: string;
    logo_url?: string;
}

export interface RefugioCreado {
    id_refugio: number;
    nombre_refugio: string;
    direccion: string;
}

@Injectable({ providedIn: 'root' })
export class RefugioService {
    constructor(private http: HttpClient) {}

    crear(datos: RefugioCrear): Observable<RefugioCreado> {
        return this.http.post<RefugioCreado>(`${environment.apiUrl}/refugios`, datos);
    }

    listar(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/refugios`);
    }
}