import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const CLOUD_NAME = 's2vsciq3';
const UPLOAD_PRESET = 'coda_garo_unsigned';

@Injectable({ providedIn: 'root' })
export class UploadService {
    constructor(private http: HttpClient) {}

    subirImagen(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        return this.http
            .post<{ secure_url: string }>(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData,
            )
            .pipe(map((res) => res.secure_url));
    }
}