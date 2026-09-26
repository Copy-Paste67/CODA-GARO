import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

export interface RefugioItem {
  id_refugio: number;
  nombre_refugio: string;
  direccion: string;
  descripcion?: string;
  logo_url?: string;
  verificado?: boolean;
}

@Component({
  selector: 'app-refugio-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './refugio-detalle.html',
  styleUrl: './refugio-detalle.css',
})
export class RefugioDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  refugio: RefugioItem | null = null;
  publicaciones: any[] = [];
  esDueno: boolean = false;
  esAdmin: boolean = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 1;
    this.refugio = {
      id_refugio: id,
      nombre_refugio: 'Huellitas de Amor',
      direccion: 'Av. Central 123, Ciudad',
      descripcion: 'Refugio dedicado al rescate y adopción de animales vulnerables.',
      logo_url: '',
      verificado: true
    };

    const user = this.authService.currentUser();
    this.esAdmin = user?.rol === 'ADMIN';
    this.esDueno = true;
  }

  alternarVerificacion(): void {
    if (this.refugio) {
      this.refugio.verificado = !this.refugio.verificado;
    }
  }

  eliminarRefugio(): void {
    if (confirm('¿Estás seguro de eliminar este refugio?')) {
      this.router.navigate(['/refugios']);
    }
  }
}
