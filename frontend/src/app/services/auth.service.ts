import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
    token: string;
    usuario: {
        id_usuario: number;
        nombre_completo: string;
        email: string;
        rol: string;
    };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
            .pipe(
                tap((res) => {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('usuario', JSON.stringify(res.usuario));
                }),
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    estaLogueado(): boolean {
        return !!this.getToken();
    }
}