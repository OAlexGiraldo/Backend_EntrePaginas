import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middlewares/auth.js';
import { ControladorUsuarios } from '../controllers/Controllers_usuarios.js';
import { ControladorLibros } from '../controllers/Controllers_libro.js';
import {
    Usuario,
    Libro,
    Reseña,
    Transaccion,
    Mensaje,
    Notificacion
} from '../models/index.js'; // Importa los modelos desde index.js

const router = express.Router();

const usuarioControlador = new ControladorUsuarios();
const libroControlador = new ControladorLibros();

// Ruta raíz
router.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de EntrePaginas!');
});

// Authentication Routes
router.post('/auth/register', [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], (req, res, next) => {
    console.log("--- INSPECCIÓN DE CONTRASEÑA EN RUTA ---");
    console.log("Cuerpo Completo de la Petición:", req.body);
    console.log("Valor de req.body.password:", req.body.password);
    console.log("Tipo de Dato de req.body.password:", typeof req.body.password);
    if (req.body.password) {
        console.log("Longitud de req.body.password:", req.body.password.length);
        for (let i = 0; i < req.body.password.length; i++) {
            console.log(`Carácter ${i}:`, req.body.password.charCodeAt(i));
        }
    } else {
        console.log("req.body.password es null o undefined");
    }
    console.log("--- FIN DE INSPECCIÓN ---");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
}, usuarioControlador.registrarUsuario);

// Book Routes
router.post('/libros', verifyToken, [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('usuario_id').notEmpty().withMessage('El usuario_id es requerido')
], libroControlador.registrarLibro);

router.get('/libros', libroControlador.buscarLibros);
router.get('/libros/:idLibro', libroControlador.buscarLibroPorId);
router.put('/libros/:idLibro', verifyToken, libroControlador.editarLibro);
router.delete('/libros/:idLibro', verifyToken, libroControlador.eliminarLibro);

// User Routes
router.get('/usuarios', verifyToken, usuarioControlador.buscarUsuarios);
router.get('/usuarios/:idUsuario', verifyToken, usuarioControlador.buscarUsuarioPorId);
router.put('/usuarios/:idUsuario', verifyToken, usuarioControlador.editarUsuario);
router.delete('/usuarios/:idUsuario', verifyToken, usuarioControlador.eliminarUsuario);

export default router;