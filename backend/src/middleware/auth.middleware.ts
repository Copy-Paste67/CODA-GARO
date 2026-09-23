import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
    usuario?: {
        id_usuario: number;
        rol: string;
    };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, env.jwtSecret) as { id_usuario: number; rol: string };
        req.usuario = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export const verificarRol = (...rolesPermitidos: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            res.status(403).json({ error: 'No tienes permiso para esta acción' });
            return;
        }

        next();
    };
};