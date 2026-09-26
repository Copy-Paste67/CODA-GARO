import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { ImagenService } from '../../services/imagen.service';

@Component({
    selector: 'app-test-upload',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './test-upload.html',
})
export class TestUpload {
    idAdopcion = 1;
    subiendo = false;
    guardando = false;
    urlSubida = '';
    mensaje = '';
    error = '';

    constructor(
        private uploadService: UploadService,
        private imagenService: ImagenService,
    ) {}

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        this.subiendo = true;
        this.error = '';
        this.mensaje = '';
        this.urlSubida = '';

        this.uploadService.subirImagen(file).subscribe({
            next: (url) => {
                this.urlSubida = url;
                this.subiendo = false;
            },
            error: (err) => {
                this.error = 'Error al subir a Cloudinary: ' + (err.error?.error?.message ?? err.message);
                this.subiendo = false;
            },
        });
    }

    guardarEnBackend(): void {
        this.guardando = true;
        this.error = '';

        this.imagenService.guardarImagen(this.urlSubida, this.idAdopcion).subscribe({
            next: () => {
                this.mensaje = 'Imagen guardada correctamente en la base de datos';
                this.guardando = false;
            },
            error: (err) => {
                this.error = 'Error al guardar en el backend: ' + (err.error?.error ?? err.message);
                this.guardando = false;
            },
        });
    }
}