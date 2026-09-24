import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa todos los campos.';
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
        this.error = err.error?.message || 'Error al iniciar sesión. Revisa tus credenciales.';
      }
    });
  }
}