import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { crearUsuario, buscarUsuarioPorEmail, buscarUsuarioPorId } from '../models/usuario.model';
import { AuthRequest } from '../middleware/auth.middleware';

const ROLES_PERMITIDOS_REGISTRO = ['REFUGIO', 'RESCATISTA', 'ADOPTANTE'];
const PASSWORD_MIN_LENGTH = 6;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registro = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nombre_completo, email, password, rol, telefono } = req.body;

    if (!nombre_completo || !email || !password || !rol) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const rolNormalizado = String(rol).trim().toUpperCase();

    if (!EMAIL_REGEX.test(emailNormalizado)) {
        throw new AppError('El correo no tiene un formato válido', 400);
    }

    if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
        throw new AppError(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`, 400);
    }

    if (!ROLES_PERMITIDOS_REGISTRO.includes(rolNormalizado)) {
        throw new AppError('Rol inválido. Debe ser REFUGIO, RESCATISTA o ADOPTANTE', 400);
    }

    const usuarioExistente = await buscarUsuarioPorEmail(emailNormalizado);

    if (usuarioExistente) {
        throw new AppError('Ese correo ya está registrado', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id_usuario = await crearUsuario(nombre_completo, emailNormalizado, passwordHash, rolNormalizado, telefono);

    const token = jwt.sign(
        { id_usuario, rol: rolNormalizado },
        env.jwtSecret,
        { expiresIn: '8h' },
    );

    res.status(201).json({
        token,
        usuario: {
            id_usuario,
            nombre_completo,
            email: emailNormalizado,
            telefono: telefono ?? null,
            rol: rolNormalizado,
        },
    });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const usuario = await buscarUsuarioPorEmail(emailNormalizado);

    if (!usuario) {
        throw new AppError('Credenciales inválidas', 401);
    }

    if (!usuario.activo) {
        throw new AppError('Cuenta de usuario inactiva', 403);
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
            telefono: usuario.telefono,
            rol: usuario.rol,
            foto_perfil_url: usuario.foto_perfil_url,
        },
    });
});

export const perfil = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const usuario = await buscarUsuarioPorId(req.usuario!.id_usuario);

    if (!usuario) {
        throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        foto_perfil_url: usuario.foto_perfil_url,
        fecha_registro: usuario.fecha_registro,
        activo: usuario.activo,
    });
});