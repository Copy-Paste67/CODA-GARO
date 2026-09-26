import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publicacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicacion-form.html',
  styleUrl: './publicacion-form.css',
})
export class PublicacionForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formPublicacion!: FormGroup;
  esEdicion: boolean = false;
  guardando: boolean = false;
  errorFormulario: string | null = null;
  imagenError: boolean = false;

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
      imagen_url: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
    }
  }

  guardar(): void {
    if (this.formPublicacion.invalid) {
      this.errorFormulario = 'Por favor completa todos los campos requeridos correctamente.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = null;

    setTimeout(() => {
      this.guardando = false;
      alert(`¡Mascota ${this.formPublicacion.value.nombre_mascota} ${this.esEdicion ? 'actualizada' : 'publicada'} con éxito!`);
      this.router.navigate(['/publicaciones']);
    }, 800);
  }

  cancelar(): void {
    this.router.navigate(['/publicaciones']);
  }
}
