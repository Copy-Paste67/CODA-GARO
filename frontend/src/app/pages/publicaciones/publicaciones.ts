import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PublicacionService } from '../../services/publicacion.service';
import { PublicacionAdopcion, FiltrosPublicacion } from '../../models/publicacion.model';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css']
})
export class PublicacionesComponent implements OnInit {
  private publicacionService = inject(PublicacionService);
  private router = inject(Router);

  publicaciones = signal<PublicacionAdopcion[]>([]);
  publicacionesFiltradas = signal<PublicacionAdopcion[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  // Filtros
  filtroEspecie: string = '';
  filtroRangoEdad: string = '';
  filtroPais: string = '';
  filtroCiudad: string = '';

  // Datos mock enriquecidos de respaldo
  private mockMascotas: PublicacionAdopcion[] = [
    {
      id_adopcion: 1,
      id_publicacion: 1,
      nombre_mascota: 'Max',
      nombre_animal: 'Max',
      especie: 'PERRO',
      rango_edad: 'JOVEN',
      edad_aproximada: '2 años',
      pais: 'México',
      ciudad: 'Ciudad de México',
      tamanio: 'MEDIANO',
      descripcion: 'Cariñoso, juguetón, vacunado y esterilizado. Convive excelente con niños y otros perros.',
      estado: 'DISPONIBLE',
      imagenes: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80']
    },
    {
      id_adopcion: 2,
      id_publicacion: 2,
      nombre_mascota: 'Mía',
      nombre_animal: 'Mía',
      especie: 'GATO',
      rango_edad: 'CACHORRO',
      edad_aproximada: '5 meses',
      pais: 'México',
      ciudad: 'Guadalajara',
      tamanio: 'PEQUENO',
      descripcion: 'Gatita tricolor muy dulce y ronroneadora. Rescatada de un árbol, lista para un hogar.',
      estado: 'DISPONIBLE',
      imagenes: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80']
    },
    {
      id_adopcion: 3,
      id_publicacion: 3,
      nombre_mascota: 'Lucas',
      nombre_animal: 'Lucas',
      especie: 'CONEJO',
      rango_edad: 'JOVEN',
      edad_aproximada: '1 año',
      pais: 'Colombia',
      ciudad: 'Bogotá',
      tamanio: 'PEQUENO',
      descripcion: 'Conejo enano súper dócil y acostumbrado a comer heno fresco y verduras.',
      estado: 'DISPONIBLE',
      imagenes: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80']
    },
    {
      id_adopcion: 4,
      id_publicacion: 4,
      nombre_mascota: 'Rocky',
      nombre_animal: 'Rocky',
      especie: 'PERRO',
      rango_edad: 'SENIOR',
      edad_aproximada: '8 años',
      pais: 'España',
      ciudad: 'Madrid',
      tamanio: 'GRANDE',
      descripcion: 'Un abuelito amoroso y tranquilo que solo busca un rincón acogedor para descansar.',
      estado: 'DISPONIBLE',
      imagenes: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80']
    },
    {
      id_adopcion: 5,
      id_publicacion: 5,
      nombre_mascota: 'Kiwi',
      nombre_animal: 'Kiwi',
      especie: 'AVE',
      rango_edad: 'ADULTO',
      edad_aproximada: '3 años',
      pais: 'Chile',
      ciudad: 'Santiago',
      tamanio: 'PEQUENO',
      descripcion: 'Periquito australiano alegre que canta con la música y socializa fácilmente.',
      estado: 'DISPONIBLE',
      imagenes: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80']
    },
    {
      id_adopcion: 6,
      id_publicacion: 6,
      nombre_mascota: 'Niko',
      nombre_animal: 'Niko',
      especie: 'ROEDOR',
      rango_edad: 'CACHORRO',
      edad_aproximada: '6 meses',
      pais: 'Argentina',
      ciudad: 'Buenos Aires',
      tamanio: 'PEQUENO',
      descripcion: 'Cobaya cariñosa, incluye jaula amplia y bebedero. Muy limpia y sociable.',
      estado: 'DISPONIBLE',
      imagenes: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80']
    }
  ];

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.cargando.set(true);
    this.error.set(null);

    const filtros: FiltrosPublicacion = {
      especie: this.filtroEspecie || undefined,
      rango_edad: this.filtroRangoEdad || undefined,
      pais: this.filtroPais || undefined,
      ciudad: this.filtroCiudad || undefined
    };

    this.publicacionService.getPublicaciones(filtros).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.publicaciones.set(data);
          this.aplicarFiltrosLocales(data);
        } else {
          this.publicaciones.set(this.mockMascotas);
          this.aplicarFiltrosLocales(this.mockMascotas);
        }
        this.cargando.set(false);
      },
      error: () => {
        // En caso de que el backend no responda, usamos los datos locales para no romper la experiencia
        this.publicaciones.set(this.mockMascotas);
        this.aplicarFiltrosLocales(this.mockMascotas);
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    this.aplicarFiltrosLocales(this.publicaciones());
  }

  private aplicarFiltrosLocales(lista: PublicacionAdopcion[]): void {
    const filtrado = lista.filter(pet => {
      const matchEspecie = !this.filtroEspecie || pet.especie.toUpperCase() === this.filtroEspecie.toUpperCase();
      const matchEdad = !this.filtroRangoEdad || (pet.rango_edad && pet.rango_edad.toUpperCase() === this.filtroRangoEdad.toUpperCase());
      const matchPais = !this.filtroPais || (pet.pais && pet.pais.toLowerCase().includes(this.filtroPais.toLowerCase()));
      const matchCiudad = !this.filtroCiudad || (pet.ciudad && pet.ciudad.toLowerCase().includes(this.filtroCiudad.trim().toLowerCase()));
      return matchEspecie && matchEdad && matchPais && matchCiudad;
    });

    this.publicacionesFiltradas.set(filtrado);
  }

  limpiarFiltros(): void {
    this.filtroEspecie = '';
    this.filtroRangoEdad = '';
    this.filtroPais = '';
    this.filtroCiudad = '';
    this.aplicarFiltrosLocales(this.publicaciones());
  }

  verDetalle(pet: PublicacionAdopcion): void {
    const id = pet.id_adopcion || pet.id_publicacion || 1;
    this.router.navigate(['/publicaciones', id]);
  }

  obtenerImagenPrincipal(pet: PublicacionAdopcion): string {
    if (!pet.imagenes || pet.imagenes.length === 0) {
      return 'favicon.ico';
    }
    const img = pet.imagenes[0];
    if (typeof img === 'string') return img;
    return img.url || 'favicon.ico';
  }
}