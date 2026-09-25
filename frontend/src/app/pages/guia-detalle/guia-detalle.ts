import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface GuiaItem {
  id_guia: number;
  titulo: string;
  especie_objetivo: string;
  fecha_publicacion: string;
  imagen_portada_url?: string;
  contenido_html: string;
}

@Component({
  selector: 'app-guia-detalle',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './guia-detalle.html',
  styleUrl: './guia-detalle.css',
})
export class GuiaDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  guia: GuiaItem | null = null;
  esAutor: boolean = true;
  esAdmin: boolean = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 1;
    this.guia = {
      id_guia: id,
      titulo: 'Primeros auxilios para mascotas rescatadas',
      especie_objetivo: 'PERRO / GATO',
      fecha_publicacion: new Date().toISOString(),
      imagen_portada_url: '',
      contenido_html: '<p>Aprende las pautas básicas para atender a un animalito en situación de calle mientras llega la atención veterinaria profesional.</p>'
    };

    const user = this.authService.currentUser();
    this.esAdmin = user?.rol === 'ADMIN';
  }

  eliminarGuia(): void {
    if (confirm('¿Deseas eliminar esta guía?')) {
      this.router.navigate(['/guias']);
    }
  }
}
