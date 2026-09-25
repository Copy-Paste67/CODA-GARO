import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioSesion {
  id_usuario: number;
  nombre_completo?: string;
  nombre?: string;
  email: string;
  rol: 'ADMIN' | 'REFUGIO' | 'RESCATISTA' | 'ADOPTANTE' | string;
  telefono?: string;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioSesion;
}

export interface RegistroDatos {
  nombre_completo: string;
  email: string;
  password: string;
  rol: 'REFUGIO' | 'RESCATISTA' | 'ADOPTANTE' | string;
  telefono?: string;
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
        this.guardarSesion(res.token, res.usuario);
      }),
      catchError((err) => {
        // En caso de que el backend local no esté activo, permitimos acceso con credenciales de prueba
        if (err.status === 0 || err.status === 404) {
          const mockUser: UsuarioSesion = {
            id_usuario: 1,
            nombre_completo: credenciales.email.split('@')[0],
            nombre: credenciales.email.split('@')[0],
            email: credenciales.email,
            rol: 'ADOPTANTE',
            telefono: '+52 33 1234 5678'
          };
          const mockRes: AuthResponse = {
            token: 'mock_jwt_token_' + Date.now(),
            usuario: mockUser
          };
          this.guardarSesion(mockRes.token, mockUser);
          return of(mockRes);
        }
        return throwError(() => err);
      })
    );
  }

  registro(datos: RegistroDatos): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos).pipe(
      tap((res: any) => {
        const usuarioCreado: UsuarioSesion = {
          id_usuario: res.id_usuario || Date.now(),
          nombre_completo: datos.nombre_completo,
          nombre: datos.nombre_completo,
          email: datos.email,
          rol: datos.rol,
          telefono: datos.telefono
        };
        this.guardarSesion('mock_token_' + Date.now(), usuarioCreado);
      }),
      catchError((err) => {
        if (err.status === 0 || err.status === 404) {
          const mockUser: UsuarioSesion = {
            id_usuario: Date.now(),
            nombre_completo: datos.nombre_completo,
            nombre: datos.nombre_completo,
            email: datos.email,
            rol: datos.rol,
            telefono: datos.telefono
          };
          this.guardarSesion('mock_token_' + Date.now(), mockUser);
          return of(mockUser);
        }
        return throwError(() => err);
      })
    );
  }

  private guardarSesion(token: string, usuario: UsuarioSesion): void {
    localStorage.setItem('coda_token', token);
    localStorage.setItem('coda_user', JSON.stringify(usuario));
    this.currentUser.set(usuario);
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