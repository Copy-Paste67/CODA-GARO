import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

export interface RefugioOpcion {
  id_refugio: number;
  nombre_refugio: string;
}

@Component({
  selector: 'app-donaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './donaciones.html',
  styleUrl: './donaciones.css',
})
export class Donaciones implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  formDonacion!: FormGroup;
  usuarioActual: UsuarioSesion | null = null;
  procesando: boolean = false;
  errorFormulario: string | null = null;

  montosSugeridos: number[] = [5, 10, 25, 50];

  refugios: RefugioOpcion[] = [
    { id_refugio: 1, nombre_refugio: 'Huellitas de Amor (Ciudad de México)' },
    { id_refugio: 2, nombre_refugio: 'Amigos Peludos (Guadalajara)' },
    { id_refugio: 3, nombre_refugio: 'Santuario Esperanza (Bogotá)' },
    { id_refugio: 4, nombre_refugio: 'Patitas al Rescate (Madrid)' }
  ];

  ngOnInit(): void {
    this.usuarioActual = this.authService.currentUser();
    this.formDonacion = this.fb.group({
      id_refugio: [1, [Validators.required]],
      monto: [10, [Validators.required, Validators.min(1)]],
      metodo_pago: ['TARJETA', [Validators.required]]
    });
  }

  seleccionarMonto(monto: number): void {
    this.formDonacion.patchValue({ monto });
  }

  donar(): void {
    if (this.formDonacion.invalid) return;
    this.procesando = true;
    this.errorFormulario = null;

    setTimeout(() => {
      this.procesando = false;
      const refugio = this.refugios.find(r => r.id_refugio === Number(this.formDonacion.value.id_refugio));
      alert(`¡Muchas gracias por tu donación de $${this.formDonacion.value.monto} USD a ${refugio?.nombre_refugio || 'nuestros refugios'}! Se ha enviado el comprobante a tu correo.`);
      this.formDonacion.patchValue({ monto: 10 });
    }, 1200);
  }
}
