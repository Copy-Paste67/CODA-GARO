// src/app/models/publicacion.model.ts
export interface ImagenMascota {
  id_imagen?: number;
  url: string;
  es_principal?: boolean;
}

export interface PublicacionAdopcion {
  id_publicacion?: number;
  id_usuario?: number;
  nombre_mascota: string;
  especie: 'perro' | 'gato' | 'otro';
  edad_aproximada: string;
  tamano: 'pequeño' | 'mediano' | 'grande';
  descripcion: string;
  estado_adopcion?: 'disponible' | 'en_proceso' | 'adoptado';
  latitud?: number;
  longitud?: number;
  imagenes: ImagenMascota[] | string[];
  fecha_publicacion?: string;
  distancia_km?: number; // Calculado si viene con geocoding
}

export interface FiltrosPublicacion {
  especie?: string;
  tamano?: string;
  radioKm?: number;
  lat?: number;
  lng?: number;
}