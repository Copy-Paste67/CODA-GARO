import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Comentario {
  id_comentario?: number;
  autor: string;
  contenido: string;
  fecha?: string;
}

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css',
})
export class Comentarios {
  @Input() comentarios: Comentario[] = [];
  @Input() idReporte?: number;
  @Input() idPublicacion?: number;

  nuevoComentario: string = '';

  agregarComentario(): void {
    if (!this.nuevoComentario.trim()) return;
    this.comentarios.push({
      autor: 'Usuario',
      contenido: this.nuevoComentario.trim(),
      fecha: new Date().toISOString()
    });
    this.nuevoComentario = '';
  }
}
