import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReporteCrear {
    tipo: string;
    especie: string;
    descripcion_fisica: string;
    ubicacion_suceso: string;
    telefono_contacto?: string;
    fecha_suceso: string;
}

export interface ReporteCreado {
    id_reporte: number;
    tipo: string;
    especie: string;
    estado: string;
}

export interface Reporte {
    id_reporte: number;
    id_usuario: number;
    tipo: 'PERDIDO' | 'ENCONTRADO';
    especie: string;
    descripcion_fisica: string;
    ubicacion_suceso: string;
    telefono_contacto: string | null;
    fecha_suceso: string;
    estado: 'BUSCANDO' | 'RESUELTO';
    fecha_creacion: string;
}

export interface FiltrosReporte {
    tipo?: string;
    especie?: string;
    estado?: string;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
    constructor(private http: HttpClient) {}

    crear(datos: ReporteCrear): Observable<ReporteCreado> {
        return this.http.post<ReporteCreado>(`${environment.apiUrl}/reportes`, datos);
    }

    listar(filtros?: FiltrosReporte): Observable<Reporte[]> {
        let params = new HttpParams();

        if (filtros?.tipo) params = params.set('tipo', filtros.tipo);
        if (filtros?.especie) params = params.set('especie', filtros.especie);
        if (filtros?.estado) params = params.set('estado', filtros.estado);

        return this.http.get<Reporte[]>(`${environment.apiUrl}/reportes`, { params });
    }

    obtenerPorId(id: number): Observable<Reporte> {
        return this.http.get<Reporte>(`${environment.apiUrl}/reportes/${id}`);
    }
}