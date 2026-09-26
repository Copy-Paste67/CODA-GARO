import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  error: string | null = null;
  cargando: boolean = false;
  mostrarPassword: boolean = false;

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  loginRapido(emailDemo: string, rolDemo: string): void {
    this.email = emailDemo;
    this.password = '123456';
    this.onSubmit();
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.cargando = true;
    this.error = null;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.message || 'Credenciales incorrectas o error de conexión con el servidor.';
      }
    });
  }
}