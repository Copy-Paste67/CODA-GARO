import { Router } from 'express';
import { verificarToken, verificarRol } from '../middleware/auth.middleware';
import { crear, crearAnonima, listar, obtenerPorId, actualizar } from '../controllers/donacion.controller';

const router = Router();

// Donación anónima → pública, SIN token ( posdata :v va Antes de cualquier /:algo)
router.post('/anonima', crearAnonima);

// Donación autenticada → requiere token
router.post('/', verificarToken, crear);

// Listar → solo ADMIN
router.get('/', verificarToken, verificarRol('ADMIN'), listar);

// Ver una → ADMIN o dueño
router.get('/:id', verificarToken, obtenerPorId);

// Actualizar estado → solo ADMIN
router.patch('/:id', verificarToken, verificarRol('ADMIN'), actualizar);

export default router;