import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { ReporteService } from '../../services/reporte.service';
import { ImagenService } from '../../services/imagen.service';

@Component({
  selector: 'app-reporte-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporte-form.html',
  styleUrl: './reporte-form.css',
})
export class ReporteForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private uploadService = inject(UploadService);
  private reporteService = inject(ReporteService);
  private imagenService = inject(ImagenService);

  formReporte!: FormGroup;
  esEdicion = false;
  guardando = false;
  errorFormulario: string | null = null;

  subiendoFoto = signal(false);
  fotoUrl = signal<string | null>(null);
  errorFoto = signal<string | null>(null);

  ngOnInit(): void {
    this.formReporte = this.fb.group({
      tipo: ['PERDIDO', [Validators.required]],
      especie: ['', [Validators.required]],
      ubicacion_suceso: ['', [Validators.required]],
      fecha_suceso: ['', [Validators.required]],
      descripcion_fisica: ['', [Validators.required]],
      telefono_contacto: ['', [Validators.required]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.esEdicion = true;
  }

  onFotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.subiendoFoto.set(true);
    this.errorFoto.set(null);

    this.uploadService.subirImagen(file).subscribe({
      next: (url) => {
        this.fotoUrl.set(url);
        this.subiendoFoto.set(false);
      },
      error: () => {
        this.errorFoto.set('No se pudo subir la foto. Intenta de nuevo.');
        this.subiendoFoto.set(false);
      },
    });
  }

  quitarFoto(): void {
    this.fotoUrl.set(null);
  }

  guardar(): void {
    if (this.formReporte.invalid) {
      this.errorFormulario = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = null;

    const valores = this.formReporte.value;

    this.reporteService
  .crear({
    tipo: valores.tipo,
    especie: valores.especie,
    descripcion_fisica: valores.descripcion_fisica,
    ubicacion_suceso: valores.ubicacion_suceso,
    telefono_contacto: valores.telefono_contacto,
    fecha_suceso: valores.fecha_suceso,
  })
  .subscribe({
        next: (respuesta) => {
          const idReporteNuevo = respuesta.id_reporte;

          if (this.fotoUrl()) {
            this.imagenService.guardarImagen(this.fotoUrl()!, undefined, idReporteNuevo).subscribe({
              next: () => this.finalizarGuardado(),
              error: () => this.finalizarGuardado(),
            });
          } else {
            this.finalizarGuardado();
          }
        },
        error: (err) => {
          this.guardando = false;
          this.errorFormulario = err.error?.error ?? 'No se pudo publicar el reporte. Intenta de nuevo.';
        },
      });
  }

  private finalizarGuardado(): void {
    this.guardando = false;
    this.router.navigate(['/reportes']);
  }

  cancelar(): void {
    this.router.navigate(['/reportes']);
  }
}