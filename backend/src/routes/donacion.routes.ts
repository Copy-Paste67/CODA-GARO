import { Router } from 'express';
import { verificarToken, verificarRol } from '../middleware/auth.middleware';
import { crear, crearAnonima, listar, obtenerPorId, actualizar } from '../controllers/donacion.controller';

const router = Router();

// Donación anónima → pública, SIN token (va ANTES de cualquier /:algo)
router.post('/anonima', crearAnonima);

// Donación autenticada → requiere token
router.post('/', verificarToken, crear);

// Listar → cualquier usuario autenticado (admin ve todas, usuario ve las suyas)
router.get('/', verificarToken, listar);

// Ver una → ADMIN o dueño
router.get('/:id', verificarToken, obtenerPorId);

// Actualizar estado → solo ADMIN
router.patch('/:id', verificarToken, verificarRol('ADMIN'), actualizar);

export default router;