import { Component, OnInit, inject, signal } from '@angular/core';
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
    refugios = signal<Refugio[]>([]);
    cargando = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.usuarioActual = this.authService.currentUser();
        this.cargarRefugios();
    }

    cargarRefugios(): void {
        this.cargando.set(true);
        this.error.set(null);

        this.refugioService.listar().subscribe({
            next: (data) => {
                this.refugios.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudo cargar la lista de refugios');
                this.cargando.set(false);
            },
        });
    }
}