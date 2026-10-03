import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { crearUsuario, buscarUsuarioPorEmail } from '../models/usuario.model';

const ROLES_PERMITIDOS_REGISTRO = ['REFUGIO', 'RESCATISTA', 'ADOPTANTE'];
const PASSWORD_MIN_LENGTH = 6;

// Validación básica de formato de email (evita emails basura como "a@b" o "sin-arroba")
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registro = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nombre_completo, email, password, rol, telefono } = req.body;

    // 1. Campos obligatorios
    if (!nombre_completo || !email || !password || !rol) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    // 2. Validar formato de email
    if (!EMAIL_REGEX.test(email)) {
        throw new AppError('El correo no tiene un formato válido', 400);
    }

    // 3. Validar longitud mínima de la contraseña
    if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
        throw new AppError(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`, 400);
    }

    // 4. Validar rol
    if (!ROLES_PERMITIDOS_REGISTRO.includes(rol)) {
        throw new AppError('Rol inválido. Debe ser REFUGIO, RESCATISTA o ADOPTANTE', 400);
    }

    // 5. Verificar que el email no esté ya registrado
    const usuarioExistente = await buscarUsuarioPorEmail(email);

    if (usuarioExistente) {
        throw new AppError('Ese correo ya está registrado', 409);
    }

    // 6. Crear usuario
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