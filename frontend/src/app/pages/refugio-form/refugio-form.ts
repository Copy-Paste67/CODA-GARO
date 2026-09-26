import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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

  formRefugio!: FormGroup;
  esEdicion: boolean = false;
  guardando: boolean = false;
  errorFormulario: string | null = null;

  ngOnInit(): void {
    this.formRefugio = this.fb.group({
      nombre_refugio: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      descripcion: [''],
      logo_url: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
    }
  }

  guardar(): void {
    if (this.formRefugio.invalid) return;
    this.guardando = true;
    this.errorFormulario = null;

    setTimeout(() => {
      this.guardando = false;
      this.router.navigate(['/refugios']);
    }, 600);
  }

  cancelar(): void {
    this.router.navigate(['/refugios']);
  }
}
