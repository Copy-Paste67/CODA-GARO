drop database if exists coda_garo_DB;
create database coda_garo_DB;
use coda_garo_DB;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS solicitud_adopcion;
DROP TABLE IF EXISTS guia_rescate;
DROP TABLE IF EXISTS donacion;
DROP TABLE IF EXISTS comentario;
DROP TABLE IF EXISTS imagen;
DROP TABLE IF EXISTS reporte_mascota;
DROP TABLE IF EXISTS publicacion_adopcion;
DROP TABLE IF EXISTS refugio;
DROP TABLE IF EXISTS usuario;

-- ==========================================
-- 2. CREACIÓN DE TABLAS
-- ==========================================

-- 1. Usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('ADMIN', 'REFUGIO', 'RESCATISTA', 'ADOPTANTE') NOT NULL,
    foto_perfil_url VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- 2. Refugio
CREATE TABLE refugio (
    id_refugio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_refugio VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    descripcion TEXT,
    logo_url VARCHAR(255),
    datos_bancarios TEXT, -- recomendado: cifrar en la app o guardar solo un token del proveedor de pagos
    verificado BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_refugio_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT uq_refugio_usuario UNIQUE (id_usuario) -- un usuario administra un solo refugio
) ENGINE=InnoDB;

-- 3. PublicacionAdopcion
CREATE TABLE publicacion_adopcion (
    id_adopcion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_animal VARCHAR(100),
    especie ENUM('PERRO', 'GATO', 'AVE', 'OTRO') NOT NULL,
    raza_aparente VARCHAR(100),
    edad_aproximada VARCHAR(50),
    tamanio ENUM('PEQUENO', 'MEDIANO', 'GRANDE') NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('DISPONIBLE', 'EN_TRAMITE', 'ADOPTADO') DEFAULT 'DISPONIBLE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adopcion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. ReporteMascota
CREATE TABLE reporte_mascota (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo ENUM('PERDIDO', 'ENCONTRADO') NOT NULL,
    especie ENUM('PERRO', 'GATO', 'AVE', 'OTRO') NOT NULL,
    descripcion_fisica TEXT NOT NULL,
    ubicacion_suceso VARCHAR(255) NOT NULL,
    fecha_suceso DATE NOT NULL,
    estado ENUM('BUSCANDO', 'RESUELTO') DEFAULT 'BUSCANDO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reporte_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Imagen
CREATE TABLE imagen (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    url_imagen VARCHAR(255) NOT NULL,
    id_adopcion INT,
    id_reporte INT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_imagen_adopcion FOREIGN KEY (id_adopcion) REFERENCES publicacion_adopcion(id_adopcion) ON DELETE CASCADE,
    CONSTRAINT fk_imagen_reporte FOREIGN KEY (id_reporte) REFERENCES reporte_mascota(id_reporte) ON DELETE CASCADE,
    CONSTRAINT chk_imagen_origen CHECK (
        (id_adopcion IS NOT NULL AND id_reporte IS NULL) OR
        (id_adopcion IS NULL AND id_reporte IS NOT NULL)
    )
) ENGINE=InnoDB;

-- 6. Comentario
CREATE TABLE comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_adopcion INT,
    id_reporte INT,
    contenido TEXT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_adopcion FOREIGN KEY (id_adopcion) REFERENCES publicacion_adopcion(id_adopcion) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_reporte FOREIGN KEY (id_reporte) REFERENCES reporte_mascota(id_reporte) ON DELETE CASCADE,
    CONSTRAINT chk_comentario_origen CHECK (
        (id_adopcion IS NOT NULL AND id_reporte IS NULL) OR
        (id_adopcion IS NULL AND id_reporte IS NOT NULL)
    )
) ENGINE=InnoDB;

-- 7. Donacion
CREATE TABLE donacion (
    id_donacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT, -- Puede ser nulo para donaciones anónimas
    id_refugio INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('TARJETA', 'TRANSFERENCIA', 'PAYPAL') NOT NULL,
    id_transaccion VARCHAR(100),
    estado_pago ENUM('COMPLETADO', 'PENDIENTE', 'FALLIDO') DEFAULT 'PENDIENTE',
    fecha_donacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_donacion_refugio FOREIGN KEY (id_refugio) REFERENCES refugio(id_refugio) ON DELETE RESTRICT, -- evita borrar un refugio con historial de donaciones
    CONSTRAINT chk_monto_positivo CHECK (monto > 0)
) ENGINE=InnoDB;

-- 8. GuiaRescate
CREATE TABLE guia_rescate (
    id_guia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    especie_objetivo VARCHAR(100) NOT NULL,
    contenido_html TEXT NOT NULL,
    imagen_portada_url VARCHAR(255),
    autor_id INT, -- nullable: si se borra el autor, la guía puede conservarse
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guia_autor FOREIGN KEY (autor_id) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. SolicitudAdopcion (opcional: registra quién solicita adoptar qué animal)
-- Quítala si el flujo de "EN_TRAMITE" ya lo manejas de otra forma en la app.
CREATE TABLE solicitud_adopcion (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_adopcion INT NOT NULL,
    id_adoptante INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    mensaje TEXT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_solicitud_adopcion FOREIGN KEY (id_adopcion) REFERENCES publicacion_adopcion(id_adopcion) ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_adoptante FOREIGN KEY (id_adoptante) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 3. ÍNDICES SOBRE LLAVES FORÁNEAS
-- ==========================================
CREATE INDEX idx_refugio_usuario ON refugio(id_usuario);
CREATE INDEX idx_adopcion_usuario ON publicacion_adopcion(id_usuario);
CREATE INDEX idx_adopcion_estado ON publicacion_adopcion(estado);
CREATE INDEX idx_reporte_usuario ON reporte_mascota(id_usuario);
CREATE INDEX idx_imagen_adopcion ON imagen(id_adopcion);
CREATE INDEX idx_imagen_reporte ON imagen(id_reporte);
CREATE INDEX idx_comentario_usuario ON comentario(id_usuario);
CREATE INDEX idx_comentario_adopcion ON comentario(id_adopcion);
CREATE INDEX idx_comentario_reporte ON comentario(id_reporte);
CREATE INDEX idx_donacion_usuario ON donacion(id_usuario);
CREATE INDEX idx_donacion_refugio ON donacion(id_refugio);
CREATE INDEX idx_guia_autor ON guia_rescate(autor_id);
CREATE INDEX idx_solicitud_adopcion ON solicitud_adopcion(id_adopcion);
CREATE INDEX idx_solicitud_adoptante ON solicitud_adopcion(id_adoptante);
