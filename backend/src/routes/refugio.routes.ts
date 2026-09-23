import { Router } from 'express';
import { verificarToken, verificarRol } from '../middleware/auth.middleware';
import { crear, listar, obtenerPorId, actualizar, eliminar, verificar } from '../controllers/refugio.controller';

const router = Router();

router.get('/', listar);
router.get('/:id', obtenerPorId);
router.post('/', verificarToken, verificarRol('REFUGIO'), crear);
router.put('/:id', verificarToken, actualizar);
router.patch('/:id/verificar', verificarToken, verificarRol('ADMIN'), verificar);
router.delete('/:id', verificarToken, eliminar);

export default router;