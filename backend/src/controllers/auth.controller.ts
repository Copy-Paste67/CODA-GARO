import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { crearUsuario, buscarUsuarioPorEmail } from '../models/usuario.model';

const ROLES_PERMITIDOS_REGISTRO = ['REFUGIO', 'RESCATISTA', 'ADOPTANTE'];

export const registro = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nombre_completo, email, password, rol, telefono } = req.body;

    if (!nombre_completo || !email || !password || !rol) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    if (!ROLES_PERMITIDOS_REGISTRO.includes(rol)) {
        throw new AppError('Rol inválido. Debe ser REFUGIO, RESCATISTA o ADOPTANTE', 400);
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);

    if (usuarioExistente) {
        throw new AppError('Ese correo ya está registrado', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id_usuario = await crearUsuario(nombre_completo, email, passwordHash, rol, telefono);

    res.status(201).json({ id_usuario, nombre_completo, email, rol });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
        throw new AppError('Credenciales inválidas', 401);
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
        throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
        { id_usuario: usuario.id_usuario, rol: usuario.rol },
        env.jwtSecret,
        { expiresIn: '8h' },
    );

    res.json({
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre_completo: usuario.nombre_completo,
            email: usuario.email,
            rol: usuario.rol,
        },
    });
});