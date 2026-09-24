import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioSesion {
  id_usuario: number;
  nombre: string;
  email: string;
  rol?: string;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioSesion;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<UsuarioSesion | null>(this.obtenerUsuarioAlmacenado());

  login(credenciales: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res) => {
        localStorage.setItem('coda_token', res.token);
        localStorage.setItem('coda_user', JSON.stringify(res.usuario));
        this.currentUser.set(res.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('coda_token');
    localStorage.removeItem('coda_user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('coda_token');
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  private obtenerUsuarioAlmacenado(): UsuarioSesion | null {
    const raw = localStorage.getItem('coda_user');
    return raw ? JSON.parse(raw) : null;
  }
}