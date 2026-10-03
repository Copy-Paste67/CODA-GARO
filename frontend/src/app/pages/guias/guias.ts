import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GuiaService, Guia } from '../../services/guia.service';

@Component({
    selector: 'app-guias',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './guias.html',
    styleUrl: './guias.css',
})
export class Guias implements OnInit {
    private guiaService = inject(GuiaService);

    guias: Guia[] = [];
    cargando = true;
    error: string | null = null;

    ngOnInit(): void {
        this.guiaService.listar().subscribe({
            next: (data) => {
                this.guias = data;
                this.cargando = false;
            },
            error: () => {
                this.error = 'No se pudo cargar la lista de guías';
                this.cargando = false;
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