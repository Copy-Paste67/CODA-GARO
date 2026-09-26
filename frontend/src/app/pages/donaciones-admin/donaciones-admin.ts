import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface DonacionItem {
  id_donacion: number;
  nombre_refugio: string;
  id_usuario?: number;
  nombre_donante?: string;
  monto: number;
  metodo_pago: string;
  estado_pago: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO';
  fecha_donacion: string;
}

@Component({
  selector: 'app-donaciones-admin',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './donaciones-admin.html',
  styleUrl: './donaciones-admin.css',
})
export class DonacionesAdmin implements OnInit {
  private fb = inject(FormBuilder);

  formFiltros!: FormGroup;
  refugios: any[] = [
    { id_refugio: 1, nombre_refugio: 'Huellitas de Amor' },
    { id_refugio: 2, nombre_refugio: 'Amigos Peludos' }
  ];

  donaciones: DonacionItem[] = [
    {
      id_donacion: 1,
      nombre_refugio: 'Huellitas de Amor',
      id_usuario: 10,
      nombre_donante: 'Carlos Mendoza',
      monto: 50,
      metodo_pago: 'TARJETA',
      estado_pago: 'COMPLETADO',
      fecha_donacion: new Date().toISOString()
    },
    {
      id_donacion: 2,
      nombre_refugio: 'Amigos Peludos',
      monto: 20,
      metodo_pago: 'PAYPAL',
      estado_pago: 'PENDIENTE',
      fecha_donacion: new Date().toISOString()
    }
  ];

  donacionesOriginales: DonacionItem[] = [];

  ngOnInit(): void {
    this.donacionesOriginales = [...this.donaciones];
    this.formFiltros = this.fb.group({
      id_refugio: [''],
      estado_pago: ['']
    });
  }

  aplicarFiltros(): void {
    const { id_refugio, estado_pago } = this.formFiltros.value;
    this.donaciones = this.donacionesOriginales.filter(d => {
      const matchRefugio = !id_refugio || d.nombre_refugio.includes(id_refugio);
      const matchEstado = !estado_pago || d.estado_pago === estado_pago;
      return matchRefugio && matchEstado;
    });
  }

  actualizarEstado(idDonacion: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const item = this.donaciones.find(d => d.id_donacion === idDonacion);
    if (item) {
      item.estado_pago = target.value as any;
    }
  }
}
