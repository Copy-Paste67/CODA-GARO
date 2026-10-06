import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicacionService } from '../../services/publicacion.service';
import { SolicitudAdopcionService } from '../../services/solicitud-adopcion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css',
})
export class PublicacionDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);
  private publicacionService = inject(PublicacionService);
  private solicitudService = inject(SolicitudAdopcionService);
  private authService = inject(AuthService);

  mascota: any = null;
  cargando = true;
  errorCarga: string | null = null;
  errorSolicitud: string | null = null;
  enviandoSolicitud = false;
  esMascotaDeDemostracion = false;
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) {
      this.cargando = false;
      this.errorCarga = 'La publicación solicitada no es válida.';
      this.changeDetector.markForCheck();
      return;
    }

    this.publicacionService.getPublicacionPorId(id).subscribe({
      next: (data) => {
        if (data) {
          const imagenes = (data as any).imagenes;
          const img = (data as any).imagen_principal || (imagenes && imagenes.length > 0)
            ? (data as any).imagen_principal || (typeof imagenes[0] === 'string' ? imagenes[0] : imagenes[0].url)
            : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
          this.mascota = { ...data, imagen: img };
        } else {
          this.mascota = this.mockMascotas[id] || this.mockMascotas[1];
        }
        this.cargando = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.mascota = this.mockMascotas[id] || this.mockMascotas[1];
        this.esMascotaDeDemostracion = !!this.mascota;
        this.cargando = false;
        if (!this.mascota) this.errorCarga = 'No se pudo cargar la publicación.';
        this.changeDetector.markForCheck();
      }
    });
  }

  abrirModalAdopcion(): void {
    if (!this.authService.isAutenticado()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.solicitudEnviada = false;
    this.errorSolicitud = null;
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
    const idAdopcion = Number(this.mascota?.id_adopcion);
    if (!this.datosSolicitud.nombre || !this.datosSolicitud.telefono || !idAdopcion || this.enviandoSolicitud) return;

    if (this.esMascotaDeDemostracion) {
      this.errorSolicitud = 'Esta mascota es una demostración. Selecciona una publicación registrada en la base de datos para enviar una solicitud.';
      return;
    }

    if (!this.authService.isAutenticado()) {
      this.mostrarModalAdopcion = false;
      this.abrirModalAdopcion();
      return;
    }

    this.enviandoSolicitud = true;
    this.errorSolicitud = null;
    this.solicitudService.crear({
      id_adopcion: idAdopcion,
      mensaje: `${this.datosSolicitud.nombre} - ${this.datosSolicitud.telefono}: ${this.datosSolicitud.motivo}`
    }).subscribe({
      next: () => {
        this.enviandoSolicitud = false;
        this.solicitudEnviada = true;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        this.enviandoSolicitud = false;
        this.errorSolicitud = err.error?.error || err.error?.message || 'No se pudo enviar la solicitud. Intenta de nuevo.';
        this.changeDetector.markForCheck();
      }
    });
  }
}
