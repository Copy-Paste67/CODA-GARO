import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { GaleriaImagenes } from '../../components/galeria-imagenes/galeria-imagenes';
import { Comentarios, Comentario } from '../../components/comentarios/comentarios';

export interface ReporteItem {
  id_reporte: number;
  tipo: 'PERDIDO' | 'ENCONTRADO';
  especie: string;
  estado: 'BUSCANDO' | 'RESUELTO';
  ubicacion_suceso: string;
  fecha_suceso: string;
  descripcion_fisica: string;
}

@Component({
  selector: 'app-reporte-detalle',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, GaleriaImagenes, Comentarios],
  templateUrl: './reporte-detalle.html',
  styleUrl: './reporte-detalle.css',
})
export class ReporteDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  reporte: ReporteItem | null = null;
  imagenes: string[] = [];
  comentarios: Comentario[] = [];
  esDueno: boolean = false;
  esAdmin: boolean = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 1;
    this.reporte = {
      id_reporte: id,
      tipo: 'PERDIDO',
      especie: 'PERRO',
      estado: 'BUSCANDO',
      ubicacion_suceso: 'Parque Central',
      fecha_suceso: new Date().toISOString(),
      descripcion_fisica: 'Golden Retriever con collar rojo, responde al nombre de Toby.'
    };

    const user = this.authService.currentUser();
    this.esAdmin = user?.rol === 'ADMIN';
    this.esDueno = true;
  }

  eliminarReporte(): void {
    if (confirm('¿Deseas eliminar este reporte?')) {
      this.router.navigate(['/reportes']);
    }
  }
}
