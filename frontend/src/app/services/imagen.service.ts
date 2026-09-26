import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagenService {
    constructor(private http: HttpClient) {}

    guardarImagen(url_imagen: string, id_adopcion?: number, id_reporte?: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/imagenes`, { url_imagen, id_adopcion, id_reporte });
    }
}