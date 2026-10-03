import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { RefugioService } from '../../services/refugio.service';

export interface Refugio {
    id_refugio: number;
    nombre_refugio: string;
    direccion: string;
    descripcion?: string;
    logo_url?: string;
    verificado?: boolean;
}

@Component({
    selector: 'app-refugios',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './refugios.html',
    styleUrl: './refugios.css',
})
export class Refugios implements OnInit {
    private authService = inject(AuthService);
    private refugioService = inject(RefugioService);

    usuarioActual: UsuarioSesion | null = null;
    refugios: Refugio[] = [];
    cargando = true;
    error: string | null = null;

    ngOnInit(): void {
        this.usuarioActual = this.authService.currentUser();
        this.cargarRefugios();
    }

    cargarRefugios(): void {
        this.cargando = true;
        this.error = null;

        this.refugioService.listar().subscribe({
            next: (data) => {
                this.refugios = data;
                this.cargando = false;
            },
            error: () => {
                this.error = 'No se pudo cargar la lista de refugios';
                this.cargando = false;
            },
        });
    }
}