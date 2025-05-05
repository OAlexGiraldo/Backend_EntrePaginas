// controllers/controladoresUsuarios.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import {
 Usuario,
 Libro,
 Reseña,
 Transaccion,
 Mensaje,
 Notificacion
} from '../models/index.js'; // Importa los modelos desde index.js

export class ControladorUsuarios {
 constructor() {}

 async registrarUsuario(peticion, respuesta) {
    try {
        const errores = validationResult(peticion);
        if (!errores.isEmpty()) {
            return respuesta.status(400).json({ errores: errores.array() });
        }

        let datos = peticion.body;
        const { nombre, email, password } = datos;

        console.log("--- INSPECCIÓN DE CONTRASEÑA EN CONTROLADOR ---");
        console.log("Valor de 'datos':", datos);
        console.log("Valor de 'password' antes de hash:", password);
        console.log("Tipo de 'password' antes de hash:", typeof password);
        console.log("--- FIN DE INSPECCIÓN ---");

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre: nombre,
            email: email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: nuevoUsuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        respuesta.status(201).json({ mensaje: "Usuario registrado con éxito", usuario: nuevoUsuario, token: token });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        respuesta.status(500).json({ mensaje: "Error registrando usuario", error: error.message });
    }
}
 

 async buscarUsuarios(peticion, respuesta) {
 try {
 const usuarios = await Usuario.findAll({
 include: [
 { model: Libro, as: 'Libros' }, // Ejemplo de cómo incluir relaciones
 { model: Transaccion, as: 'compras' },
 { model: Transaccion, as: 'ventas' }
 ]
 });
 respuesta.status(200).json({ mensaje: "Usuarios encontrados", datos: usuarios });
 } catch (error) {
 console.error("Error al buscar usuarios:", error);
 respuesta.status(500).json({ mensaje: "Error buscando usuarios", error: error.message });
 }
 }

 async buscarUsuarioPorId(peticion, respuesta) {
 try {
 let id = peticion.params.idUsuario;
 const usuario = await Usuario.findByPk(id, {
 include: [
 { model: Reseña, as: 'Reseñas' }, // Otro ejemplo
 { model: Mensaje, as: 'mensajesEnviados' },
 { model: Mensaje, as: 'mensajesRecibidos' },
 { model: Notificacion, as: 'Notificaciones' }
 ]
 });
 if (!usuario) {
 return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
 }
 respuesta.status(200).json({ mensaje: "Usuario encontrado", datos: usuario });
 } catch (error) {
 console.error("Error al buscar usuario por ID:", error);
 respuesta.status(500).json({ mensaje: "Error buscando usuario", error: error.message });
 }
 }

 async editarUsuario(peticion, respuesta) {
 try {
 let id = peticion.params.idUsuario;
 let datos = peticion.body;
 const { nombre, email, password } = datos;

 let hashedPassword;
 if (password) {
 hashedPassword = await bcrypt.hash(password, 10);
 }

 const usuarioActualizado = await Usuario.update(
 {
 nombre: nombre,
 email: email,
 password: hashedPassword || undefined
 },
 {
 where: { id: id }
 }
 );

 if (usuarioActualizado[0] === 0) {
 return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
 }

 const usuarioObtenido = await Usuario.findByPk(id);
 respuesta.status(200).json({ mensaje: "Usuario editado con éxito", usuario: usuarioObtenido });
 } catch (error) {
 console.error("Error al editar usuario:", error);
 respuesta.status(500).json({ mensaje: "Error editando usuario", error: error.message });
 }
 }

 async eliminarUsuario(peticion, respuesta) {
 try {
 let id = peticion.params.idUsuario;
 const usuarioEliminado = await Usuario.destroy({
 where: { id: id }
 });

 if (usuarioEliminado === 0) {
 return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
 }

 respuesta.status(200).json({ mensaje: "Usuario eliminado" });
 } catch (error) {
 console.error("Error al eliminar usuario:", error);
 respuesta.status(500).json({ mensaje: "Error eliminando usuario", error: error.message });
 }
 }
}



