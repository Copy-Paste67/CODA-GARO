import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { RefugioService } from '../../services/refugio.service';

@Component({
  selector: 'app-refugio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './refugio-form.html',
  styleUrl: './refugio-form.css',
})
export class RefugioForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private uploadService = inject(UploadService);
  private refugioService = inject(RefugioService);

  formRefugio!: FormGroup;
  esEdicion = false;
  guardando = false;
  errorFormulario: string | null = null;

  subiendoLogo = signal(false);
  logoUrl = signal<string | null>(null);
  errorLogo = signal<string | null>(null);

  ngOnInit(): void {
    this.formRefugio = this.fb.group({
      nombre_refugio: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      descripcion: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.esEdicion = true;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.subiendoLogo.set(true);
    this.errorLogo.set(null);

    this.uploadService.subirImagen(file).subscribe({
      next: (url) => {
        this.logoUrl.set(url);
        this.subiendoLogo.set(false);
      },
      error: () => {
        this.errorLogo.set('No se pudo subir el logo. Intenta de nuevo.');
        this.subiendoLogo.set(false);
      },
    });
  }

  quitarLogo(): void {
    this.logoUrl.set(null);
  }

  guardar(): void {
    if (this.formRefugio.invalid) {
      this.errorFormulario = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = null;

    const valores = this.formRefugio.value;

    this.refugioService
      .crear({
        nombre_refugio: valores.nombre_refugio,
        direccion: valores.direccion,
        descripcion: valores.descripcion,
        logo_url: this.logoUrl() ?? undefined,
      })
      .subscribe({
        next: () => {
          this.guardando = false;
          alert(`¡Refugio ${valores.nombre_refugio} ${this.esEdicion ? 'actualizado' : 'registrado'} con éxito!`);
          this.router.navigate(['/refugios']);
        },
        error: (err) => {
          this.guardando = false;
          this.errorFormulario = err.error?.error ?? 'No se pudo registrar el refugio. Intenta de nuevo.';
        },
      });
  }

  cancelar(): void {
    this.router.navigate(['/refugios']);
  }
}