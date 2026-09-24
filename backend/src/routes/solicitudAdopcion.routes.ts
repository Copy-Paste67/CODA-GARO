import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware';
import { crear, listar, obtenerPorId, actualizar, eliminar } from '../controllers/solicitudAdopcion.controller';

const router = Router();

router.get('/', verificarToken, listar);
router.get('/:id', verificarToken, obtenerPorId);
router.post('/', verificarToken, crear);
router.patch('/:id', verificarToken, actualizar);
router.delete('/:id', verificarToken, eliminar);

export default router;