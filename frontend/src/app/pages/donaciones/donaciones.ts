import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { RefugioService } from '../../services/refugio.service';

export interface RefugioOpcion {
    id_refugio: number;
    nombre_refugio: string;
}

@Component({
    selector: 'app-donaciones',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './donaciones.html',
    styleUrl: './donaciones.css',
})
export class Donaciones implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private refugioService = inject(RefugioService);
    private route = inject(ActivatedRoute);

    formDonacion!: FormGroup;
    usuarioActual: UsuarioSesion | null = null;
    procesando = false;
    errorFormulario: string | null = null;

    montosSugeridos: number[] = [5, 10, 25, 50];
    mostrarMontoPersonalizado = signal(false);

    refugios = signal<RefugioOpcion[]>([]);
    cargandoRefugios = signal(true);

    // Si viene de un refugio específico (botón "Donar" en su tarjeta)
    refugioFijo = signal<RefugioOpcion | null>(null);

    ngOnInit(): void {
        this.usuarioActual = this.authService.currentUser();

        this.formDonacion = this.fb.group({
            id_refugio: ['', [Validators.required]],
            monto: [10, [Validators.required, Validators.min(1)]],
            metodo_pago: ['TARJETA', [Validators.required]],
        });

        const idRefugioParam = this.route.snapshot.queryParamMap.get('refugio');

        this.refugioService.listar().subscribe({
            next: (data) => {
                this.refugios.set(data);
                this.cargandoRefugios.set(false);

                if (idRefugioParam) {
                    const refugio = data.find((r: any) => r.id_refugio === Number(idRefugioParam));
                    if (refugio) {
                        this.refugioFijo.set(refugio);
                        this.formDonacion.patchValue({ id_refugio: refugio.id_refugio });
                    }
                }
            },
            error: () => {
                this.cargandoRefugios.set(false);
            },
        });
    }

    seleccionarMonto(monto: number): void {
        this.mostrarMontoPersonalizado.set(false);
        this.formDonacion.patchValue({ monto });
    }

    activarMontoPersonalizado(): void {
        this.mostrarMontoPersonalizado.set(true);
        this.formDonacion.patchValue({ monto: null });
    }

    seleccionarMetodoPago(metodo: string): void {
        this.formDonacion.patchValue({ metodo_pago: metodo });
    }

    quitarRefugioFijo(): void {
        this.refugioFijo.set(null);
        this.formDonacion.patchValue({ id_refugio: '' });
    }

    donar(): void {
        if (this.formDonacion.invalid) {
            this.errorFormulario = 'Completa todos los campos requeridos.';
            return;
        }

        this.procesando = true;
        this.errorFormulario = null;

        // TODO: conectar a POST /api/donaciones una vez confirmado el backend
        setTimeout(() => {
            this.procesando = false;
            const refugio = this.refugios().find((r) => r.id_refugio === Number(this.formDonacion.value.id_refugio));
            alert(`¡Gracias por tu donación de $${this.formDonacion.value.monto} USD a ${refugio?.nombre_refugio || 'nuestros refugios'}!`);
        }, 1200);
    }
}