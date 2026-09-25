import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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

  formReporte!: FormGroup;
  esEdicion: boolean = false;
  guardando: boolean = false;
  errorFormulario: string | null = null;

  ngOnInit(): void {
    this.formReporte = this.fb.group({
      tipo: ['PERDIDO', [Validators.required]],
      especie: ['', [Validators.required]],
      ubicacion_suceso: ['', [Validators.required]],
      fecha_suceso: ['', [Validators.required]],
      descripcion_fisica: ['', [Validators.required]],
      telefono_contacto: ['', [Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
    }
  }

  guardar(): void {
    if (this.formReporte.invalid) return;
    this.guardando = true;
    this.errorFormulario = null;

    setTimeout(() => {
      this.guardando = false;
      this.router.navigate(['/reportes']);
    }, 600);
  }

  cancelar(): void {
    this.router.navigate(['/reportes']);
  }
}
