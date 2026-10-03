import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { ReporteService, Reporte } from '../../services/reporte.service';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterLink, ReactiveFormsModule],
    templateUrl: './reportes.html',
    styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private reporteService = inject(ReporteService);

    formFiltros!: FormGroup;
    usuarioActual: UsuarioSesion | null = null;
    reportes: Reporte[] = [];
    cargando = true;
    error: string | null = null;

    ngOnInit(): void {
        this.usuarioActual = this.authService.currentUser();
        this.formFiltros = this.fb.group({
            tipo: [''],
            especie: [''],
            estado: [''],
        });
        this.cargarReportes();
    }

    cargarReportes(): void {
        this.cargando = true;
        this.error = null;

        const val = this.formFiltros?.value ?? {};

        this.reporteService
            .listar({
                tipo: val.tipo || undefined,
                especie: val.especie || undefined,
                estado: val.estado || undefined,
            })
            .subscribe({
                next: (data) => {
                    this.reportes = data;
                    this.cargando = false;
                },
                error: () => {
                    this.error = 'No se pudo cargar la lista de reportes';
                    this.cargando = false;
                },
            });
    }

    aplicarFiltros(): void {
        this.cargarReportes();
    }
}