import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { crearUsuario, buscarUsuarioPorEmail } from '../models/usuario.model';

export const registro = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre_completo, email, password, rol, telefono } = req.body;

        if (!nombre_completo || !email || !password || !rol) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        const usuarioExistente = await buscarUsuarioPorEmail(email);

        if (usuarioExistente) {
            res.status(409).json({ error: 'Ese correo ya está registrado' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const id_usuario = await crearUsuario(nombre_completo, email, passwordHash, rol, telefono);

        res.status(201).json({ id_usuario, nombre_completo, email, rol });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        const usuario = await buscarUsuarioPorEmail(email);

        if (!usuario) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
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
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};