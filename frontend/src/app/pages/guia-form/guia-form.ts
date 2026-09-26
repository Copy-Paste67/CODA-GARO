import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-guia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guia-form.html',
  styleUrl: './guia-form.css',
})
export class GuiaForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGuia!: FormGroup;
  esEdicion: boolean = false;
  guardando: boolean = false;
  errorFormulario: string | null = null;

  ngOnInit(): void {
    this.formGuia = this.fb.group({
      titulo: ['', [Validators.required]],
      especie_objetivo: ['', [Validators.required]],
      imagen_portada_url: [''],
      contenido_html: ['', [Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
    }
  }

  guardar(): void {
    if (this.formGuia.invalid) return;
    this.guardando = true;
    this.errorFormulario = null;

    setTimeout(() => {
      this.guardando = false;
      this.router.navigate(['/guias']);
    }, 600);
  }

  cancelar(): void {
    this.router.navigate(['/guias']);
  }
}
