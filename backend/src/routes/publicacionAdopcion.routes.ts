import { Router } from 'express';
import { verificarToken, verificarRol } from '../middleware/auth.middleware';
import { crear, listar, obtenerPorId, actualizar, eliminar } from '../controllers/publicacionAdopcion.controller';

const router = Router();

router.get('/', listar);
router.get('/:id', obtenerPorId);
router.post('/', verificarToken, verificarRol('REFUGIO'), crear);
router.put('/:id', verificarToken, actualizar);
router.delete('/:id', verificarToken, eliminar);

export default router;