import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

export interface Refugio {
  id_refugio: number;
  nombre_refugio: string;
  direccion: string;
  descripcion?: string;
  logo_url?: string;
  verificado?: boolean;
}

@Component({
  selector: 'app-refugios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './refugios.html',
  styleUrl: './refugios.css',
})
export class Refugios implements OnInit {
  private authService = inject(AuthService);

  usuarioActual: UsuarioSesion | null = null;
  refugios: Refugio[] = [
    {
      id_refugio: 1,
      nombre_refugio: 'Huellitas de Amor',
      direccion: 'Av. Central 123, Ciudad',
      descripcion: 'Refugio dedicado al rescate y rehabilitación de perros y gatos.',
      logo_url: '',
      verificado: true
    },
    {
      id_refugio: 2,
      nombre_refugio: 'Amigos Peludos',
      direccion: 'Calle Sol 456, Ciudad',
      descripcion: 'Hogar temporal y adopciones responsables.',
      logo_url: '',
      verificado: false
    }
  ];

  ngOnInit(): void {
    this.usuarioActual = this.authService.currentUser();
  }
}
