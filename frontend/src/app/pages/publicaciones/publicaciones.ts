import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionService, Publicacion } from '../../services/publicacion.service';

@Component({
    selector: 'app-publicaciones',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './publicaciones.html',
})
export class Publicaciones implements OnInit {
    publicaciones: Publicacion[] = [];
    cargando = true;
    error = '';

    constructor(private publicacionService: PublicacionService) {}

    ngOnInit(): void {
        this.publicacionService.listar().subscribe({
            next: (data) => {
                this.publicaciones = data;
                this.cargando = false;
            },
            error: () => {
                this.error = 'No se pudo cargar la lista de publicaciones';
                this.cargando = false;
            },
        });
    }
}