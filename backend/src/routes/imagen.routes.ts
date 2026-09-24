import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware';
import { crear, listar, obtenerPorId, eliminar } from "../controllers/imagen.controller";
const router = Router();

router.get('/', listar);
router.get('/:id', obtenerPorId);
router.post('/', verificarToken, crear);
router.delete('/:id', verificarToken, eliminar);

export default router;