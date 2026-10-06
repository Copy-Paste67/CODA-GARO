import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { buscarUsuarioPorId } from '../models/usuario.model';

export interface AuthRequest extends Request {
    usuario?: {
        id_usuario: number;
        rol: string;
    };
}

export const verificarToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, env.jwtSecret) as { id_usuario: number; rol: string };

        // Verificar que el usuario siga existiendo y esté activo
        const usuario = await buscarUsuarioPorId(payload.id_usuario);

        if (!usuario) {
            res.status(401).json({ error: 'Usuario no encontrado' });
            return;
        }

        if (!usuario.activo) {
            res.status(401).json({ error: 'Usuario inactivo' });
            return;
        }

        req.usuario = {
            id_usuario: usuario.id_usuario,
            rol: usuario.rol,
        };

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