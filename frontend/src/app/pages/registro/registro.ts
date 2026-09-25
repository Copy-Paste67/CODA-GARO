import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  formRegistro!: FormGroup;
  error: string | null = null;
  cargando: boolean = false;

  ngOnInit(): void {
    this.formRegistro = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      rol: ['ADOPTANTE', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.formRegistro.invalid) {
      this.error = 'Por favor completa todos los campos requeridos correctamente.';
      return;
    }

    const { nombre_completo, email, telefono, rol, password, confirmPassword } = this.formRegistro.value;

    if (password !== confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.error = null;

    this.authService.registro({
      nombre_completo,
      email,
      telefono,
      rol,
      password
    }).subscribe({
      next: () => {
        this.cargando = false;
        alert('¡Bienvenido a Coda Garo! Tu cuenta ha sido creada exitosamente.');
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.message || 'Hubo un problema al crear tu cuenta. Intenta nuevamente.';
      }
    });
  }
}
