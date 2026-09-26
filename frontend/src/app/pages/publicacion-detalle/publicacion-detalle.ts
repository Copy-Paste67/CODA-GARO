import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicacionService } from '../../services/publicacion.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css',
})
export class PublicacionDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private publicacionService = inject(PublicacionService);

  mascota: any = null;
  mostrarModalAdopcion: boolean = false;
  mostrarModalContacto: boolean = false;
  solicitudEnviada: boolean = false;

  datosSolicitud = {
    nombre: '',
    telefono: '',
    motivo: ''
  };

  private mockMascotas: Record<number, any> = {
    1: {
      id_adopcion: 1,
      nombre_mascota: 'Max',
      nombre_animal: 'Max',
      especie: 'PERRO',
      rango_edad: 'JOVEN',
      edad_aproximada: '2 años',
      pais: 'México',
      ciudad: 'Ciudad de México',
      tamanio: 'MEDIANO',
      descripcion: 'Max es un perrito noble y activo, rescatado hace 3 meses. Le encanta jugar a la pelota, pasear por las mañanas y convive de maravilla con niños y otros perros. Ya cuenta con su cuadro de vacunación completo y está esterilizado.',
      imagen: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
      estado: 'DISPONIBLE'
    },
    2: {
      id_adopcion: 2,
      nombre_mascota: 'Mía',
      nombre_animal: 'Mía',
      especie: 'GATO',
      rango_edad: 'CACHORRO',
      edad_aproximada: '5 meses',
      pais: 'México',
      ciudad: 'Guadalajara',
      tamanio: 'PEQUENO',
      descripcion: 'Mía es una hermosa gatita tricolor, muy tranquila, limpia y cariñosa. Se entrega desparasitada, vacunada y lista para llenar de amor su nuevo hogar.',
      imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
      estado: 'DISPONIBLE'
    },
    3: {
      id_adopcion: 3,
      nombre_mascota: 'Lucas',
      nombre_animal: 'Lucas',
      especie: 'CONEJO',
      rango_edad: 'JOVEN',
      edad_aproximada: '1 año',
      pais: 'Colombia',
      ciudad: 'Bogotá',
      tamanio: 'PEQUENO',
      descripcion: 'Lucas es un conejito dócil y curioso. Requiere espacio para correr en interiores y una dieta rica en heno timothy y verduras frescas.',
      imagen: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
      estado: 'DISPONIBLE'
    }
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 1;
    this.publicacionService.getPublicacionPorId(id).subscribe({
      next: (data) => {
        if (data) {
          const img = (data.imagenes && data.imagenes.length > 0)
            ? (typeof data.imagenes[0] === 'string' ? data.imagenes[0] : (data.imagenes[0] as any).url)
            : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
          this.mascota = { ...data, imagen: img };
        } else {
          this.mascota = this.mockMascotas[id] || this.mockMascotas[1];
        }
      },
      error: () => {
        this.mascota = this.mockMascotas[id] || this.mockMascotas[1];
      }
    });
  }

  abrirModalAdopcion(): void {
    this.solicitudEnviada = false;
    this.mostrarModalAdopcion = true;
  }

  abrirModalContacto(): void {
    this.mostrarModalContacto = true;
  }

  cerrarModales(): void {
    this.mostrarModalAdopcion = false;
    this.mostrarModalContacto = false;
  }

  enviarSolicitud(): void {
    if (!this.datosSolicitud.nombre || !this.datosSolicitud.telefono) return;
    this.solicitudEnviada = true;
  }
}
