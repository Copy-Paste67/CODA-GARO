import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../../services/publicacion.service';
import { PublicacionAdopcion, FiltrosPublicacion } from '../../models/publicacion.model';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css']
})
export class PublicacionesComponent implements OnInit {
  private publicacionService = inject(PublicacionService);

  publicaciones = signal<PublicacionAdopcion[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  filtroEspecie: string = '';
  filtroTamano: string = '';
  filtroDistancia: number = 25;
  ubicacionUsuario: { lat: number; lng: number } | null = null;

  ngOnInit(): void {
    this.obtenerCoordenadasUsuario();
  }

  obtenerCoordenadasUsuario(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.ubicacionUsuario = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          this.cargarPublicaciones();
        },
        () => {
          this.cargarPublicaciones();
        }
      );
    } else {
      this.cargarPublicaciones();
    }
  }

  cargarPublicaciones(): void {
    this.cargando.set(true);
    this.error.set(null);

    const filtros: FiltrosPublicacion = {
      especie: this.filtroEspecie || undefined,
      tamano: this.filtroTamano || undefined,
      radioKm: this.filtroDistancia,
      lat: this.ubicacionUsuario?.lat,
      lng: this.ubicacionUsuario?.lng
    };

    this.publicacionService.getPublicaciones(filtros).subscribe({
      next: (data) => {
        this.publicaciones.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron obtener las publicaciones de mascotas.');
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    this.cargarPublicaciones();
  }
}