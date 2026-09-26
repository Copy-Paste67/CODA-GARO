import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galeria-imagenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria-imagenes.html',
  styleUrl: './galeria-imagenes.css',
})
export class GaleriaImagenes {
  @Input() imagenes: string[] = [];
  @Input() puedeAgregar: boolean = false;
  @Input() puedeEliminar: boolean = false;
  @Input() idReporte?: number;
  @Input() idPublicacion?: number;

  eliminarImagen(index: number): void {
    this.imagenes.splice(index, 1);
  }
}
