import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

export interface Reporte {
  id_reporte: number;
  tipo: 'PERDIDO' | 'ENCONTRADO';
  especie: string;
  estado: 'BUSCANDO' | 'RESUELTO';
  ubicacion_suceso: string;
  fecha_suceso: string;
  descripcion_fisica: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  formFiltros!: FormGroup;
  usuarioActual: UsuarioSesion | null = null;
  reportes: Reporte[] = [];
  reportesOriginales: Reporte[] = [
    {
      id_reporte: 1,
      tipo: 'PERDIDO',
      especie: 'PERRO',
      estado: 'BUSCANDO',
      ubicacion_suceso: 'Parque Central',
      fecha_suceso: new Date().toISOString(),
      descripcion_fisica: 'Golden Retriever con collar rojo, muy amigable.'
    },
    {
      id_reporte: 2,
      tipo: 'ENCONTRADO',
      especie: 'GATO',
      estado: 'BUSCANDO',
      ubicacion_suceso: 'Calle Las Palmas 102',
      fecha_suceso: new Date().toISOString(),
      descripcion_fisica: 'Gatito blanco con ojos verdes, rescatado de la lluvia.'
    }
  ];

  ngOnInit(): void {
    this.usuarioActual = this.authService.currentUser();
    this.formFiltros = this.fb.group({
      tipo: [''],
      especie: [''],
      estado: ['']
    });
    this.reportes = [...this.reportesOriginales];
  }

  aplicarFiltros(): void {
    const val = this.formFiltros.value;
    this.reportes = this.reportesOriginales.filter(r => {
      const matchTipo = !val.tipo || r.tipo === val.tipo;
      const matchEspecie = !val.especie || r.especie === val.especie;
      const matchEstado = !val.estado || r.estado === val.estado;
      return matchTipo && matchEspecie && matchEstado;
    });
  }
}
