import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Guia {
    id_guia: number;
    titulo: string;
    especie_objetivo: string;
    contenido_html: string;
    imagen_portada_url: string | null;
    autor_id: number | null;
    fecha_publicacion: string;
}

export interface GuiaCrear {
    titulo: string;
    especie_objetivo: string;
    contenido_html: string;
    imagen_portada_url?: string;
}

@Injectable({ providedIn: 'root' })
export class GuiaService {
    constructor(private http: HttpClient) {}

    listar(): Observable<Guia[]> {
        return this.http.get<Guia[]>(`${environment.apiUrl}/guias`);
    }

    obtenerPorId(id: number): Observable<Guia> {
        return this.http.get<Guia>(`${environment.apiUrl}/guias/${id}`);
    }

    crear(datos: GuiaCrear): Observable<{ id_guia: number }> {
        return this.http.post<{ id_guia: number }>(`${environment.apiUrl}/guias`, datos);
    }
}