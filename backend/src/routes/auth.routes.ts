import { Router } from 'express';
import { registro, login } from '../controllers/auth.controller';
import { verificarToken, AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);

router.get('/perfil', verificarToken, (req: AuthRequest, res: Response) => {
    res.json({ mensaje: 'Ruta protegida, acceso correcto', usuario: req.usuario });
});

export default router;