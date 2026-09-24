import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Publicacion {
    id_adopcion: number;
    nombre_animal: string | null;
    especie: string;
    raza_aparente: string | null;
    tamanio: string;
    descripcion: string;
    estado: string;
}

@Injectable({ providedIn: 'root' })
export class PublicacionService {
    constructor(private http: HttpClient) {}

    listar(): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(`${environment.apiUrl}/publicaciones`);
    }
}