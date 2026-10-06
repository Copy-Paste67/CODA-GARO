import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  email: string = '';
  password: string = '';
  error: string | null = null;
  cargando: boolean = false;
  mostrarPassword: boolean = false;

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
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
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/publicaciones');
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.message || 'Credenciales incorrectas o error de conexión con el servidor.';
      }
    });
  }
}