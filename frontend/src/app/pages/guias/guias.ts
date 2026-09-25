import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface GuiaCard {
  id_guia: number;
  titulo: string;
  especie_objetivo: string;
  resumen: string;
}

@Component({
  selector: 'app-guias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './guias.html',
  styleUrl: './guias.css',
})
export class Guias {
  guias: GuiaCard[] = [
    {
      id_guia: 1,
      titulo: 'Primeros auxilios para mascotas rescatadas',
      especie_objetivo: 'PERROS Y GATOS',
      resumen: 'Aprende los pasos esenciales a seguir cuando encuentres a un animalito desorientado o lastimado.'
    },
    {
      id_guia: 2,
      titulo: 'Nutrición y alimentación en cachorros',
      especie_objetivo: 'CACHORROS',
      resumen: 'Guía completa sobre dietas balanceadas, porciones y vacunas indispensables en sus primeros meses.'
    },
    {
      id_guia: 3,
      titulo: 'Adaptación de un gato recién adoptado en su nuevo hogar',
      especie_objetivo: 'GATOS',
      resumen: 'Consejos para reducir el estrés en felinos durante su periodo de transición y socialización.'
    }
  ];
}
