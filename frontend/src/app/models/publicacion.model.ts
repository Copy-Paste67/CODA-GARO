// src/app/models/publicacion.model.ts

export interface ImagenMascota {
  id_imagen?: number;
  url: string;
  es_principal?: boolean;
}

export interface PublicacionAdopcion {
  id_adopcion?: number;
  id_publicacion?: number;
  id_usuario?: number;
  nombre_animal?: string;
  nombre_mascota?: string;
  especie: 'PERRO' | 'GATO' | 'AVE' | 'CONEJO' | 'ROEDOR' | 'REPTIL' | 'OTRO' | string;
  raza_aparente?: string;
  edad_aproximada?: string;
  rango_edad?: 'CACHORRO' | 'JOVEN' | 'ADULTO' | 'SENIOR' | string;
  tamanio?: 'PEQUENO' | 'MEDIANO' | 'GRANDE' | string;
  tamano?: string;
  pais?: string;
  ciudad?: string;
  descripcion: string;
  estado?: 'DISPONIBLE' | 'EN_TRAMITE' | 'ADOPTADO' | string;
  estado_adopcion?: string;
  imagenes: (ImagenMascota | string)[];
  fecha_creacion?: string;
  fecha_publicacion?: string;
}

export interface FiltrosPublicacion {
  especie?: string;
  rango_edad?: string;
  pais?: string;
  ciudad?: string;
  estado?: string;
}