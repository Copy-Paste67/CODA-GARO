import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GuiaService, Guia } from '../../services/guia.service';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

@Component({
    selector: 'app-guias',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './guias.html',
    styleUrl: './guias.css',
})
export class Guias implements OnInit {
    private guiaService = inject(GuiaService);
    private authService = inject(AuthService);

    usuarioActual: UsuarioSesion | null = null;
    guias = signal<Guia[]>([]);
    cargando = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.usuarioActual = this.authService.currentUser();

        this.guiaService.listar().subscribe({
            next: (data) => {
                this.guias.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudo cargar la lista de guías');
                this.cargando.set(false);
            },
        });
    }

    obtenerResumen(guia: Guia, maxCaracteres = 140): string {
        const textoPlano = guia.contenido_html.replace(/<[^>]*>/g, '');
        return textoPlano.length > maxCaracteres
            ? textoPlano.slice(0, maxCaracteres).trim() + '...'
            : textoPlano;
    }
}