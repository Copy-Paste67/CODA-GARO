import { Router } from 'express';
import { registro, login, perfil } from '../controllers/auth.controller';
import { verificarToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

export default router;