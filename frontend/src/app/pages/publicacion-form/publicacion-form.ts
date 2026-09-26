import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { UploadService } from '../../services/upload.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ImagenService } from '../../services/imagen.service';

@Component({
  selector: 'app-publicacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageCropperComponent],
  templateUrl: './publicacion-form.html',
  styleUrl: './publicacion-form.css',
})
export class PublicacionForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private uploadService = inject(UploadService);
  private publicacionService = inject(PublicacionService);
  private imagenService = inject(ImagenService);

  formPublicacion!: FormGroup;
  esEdicion = false;
  guardando = false;
  errorFormulario: string | null = null;

  // Estado del recorte
  imagenParaRecortar = signal<string | null>(null); // la foto original, mientras se recorta
  imagenRecortada = signal<Blob | null>(null); // el resultado ya recortado, listo para subir
  imagenUrl = signal<string | null>(null); // la URL final en Cloudinary
  subiendoImagen = signal(false);
  errorImagen = signal<string | null>(null);

  ngOnInit(): void {
    this.formPublicacion = this.fb.group({
      nombre_mascota: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['PERRO', [Validators.required]],
      rango_edad: ['JOVEN', [Validators.required]],
      edad_aproximada: ['1 año', [Validators.required]],
      tamano: ['MEDIANO', [Validators.required]],
      raza_aparente: ['Mestizo'],
      pais: ['México', [Validators.required]],
      ciudad: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.esEdicion = true;
  }

  // Paso 1: el usuario elige un archivo -> se abre el recortador
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.imagenParaRecortar.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  // Paso 2: cada vez que el usuario mueve/ajusta el recuadro, se actualiza el preview recortado
  onImageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.imagenRecortada.set(event.blob);
    }
  }

  // Paso 3: el usuario confirma el recorte -> subimos SOLO el resultado recortado a Cloudinary
  confirmarRecorte(): void {
    const blob = this.imagenRecortada();
    if (!blob) return;

    const file = new File([blob], 'mascota.jpg', { type: 'image/jpeg' });

    this.subiendoImagen.set(true);
    this.errorImagen.set(null);

    this.uploadService.subirImagen(file).subscribe({
      next: (url) => {
        this.imagenUrl.set(url);
        this.imagenParaRecortar.set(null); // cierra el recortador
        this.subiendoImagen.set(false);
      },
      error: () => {
        this.errorImagen.set('No se pudo subir la imagen. Intenta de nuevo.');
        this.subiendoImagen.set(false);
      },
    });
  }

  cancelarRecorte(): void {
    this.imagenParaRecortar.set(null);
    this.imagenRecortada.set(null);
  }

  quitarImagen(): void {
    this.imagenUrl.set(null);
  }

  guardar(): void {
    if (this.formPublicacion.invalid) {
      this.errorFormulario = 'Por favor completa todos los campos requeridos correctamente.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = null;

    const valores = this.formPublicacion.value;

    this.publicacionService
      .crear({
        nombre_animal: valores.nombre_mascota,
        especie: valores.especie,
        raza_aparente: valores.raza_aparente,
        edad_aproximada: valores.edad_aproximada,
        tamanio: valores.tamano,
        descripcion: valores.descripcion,
      })
      .subscribe({
        next: (respuesta) => {
          const idAdopcionNueva = respuesta.id_adopcion;

          if (this.imagenUrl()) {
          this.imagenService.guardarImagen(this.imagenUrl()!, idAdopcionNueva).subscribe({
            next: () => this.finalizarGuardado(valores.nombre_mascota),
            error: (err) => {
              console.error('Error al guardar imagen:', err);
              alert('Ojo: la publicación se creó pero la imagen NO se guardó. Error: ' + JSON.stringify(err.error));
              this.finalizarGuardado(valores.nombre_mascota);
            },
          });
        } else {
          this.finalizarGuardado(valores.nombre_mascota);
        }
      },
      error: (err) => {
        this.guardando = false;
        this.errorFormulario = err.error?.error ?? 'No se pudo publicar la mascota. Intenta de nuevo.';
      },
    });
}

  private finalizarGuardado(nombre: string): void {
    this.guardando = false;
    alert(`¡Mascota ${nombre} ${this.esEdicion ? 'actualizada' : 'publicada'} con éxito!`);
    this.router.navigate(['/publicaciones']);
  }

  cancelar(): void {
    this.router.navigate(['/publicaciones']);
  }
}