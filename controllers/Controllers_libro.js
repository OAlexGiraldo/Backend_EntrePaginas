// controllers/controladoresLibros.js
import { validationResult } from 'express-validator';
import {
 Usuario,
 Libro,
 Reseña,
 Transaccion,
 Mensaje,
 Notificacion
} from '../models/index.js';

export class ControladorLibros {
 constructor() {}

 async registrarLibro(peticion, respuesta) {
 try {
 const errores = validationResult(peticion);
 if (!errores.isEmpty()) {
 return respuesta.status(400).json({ errores: errores.array() });
 }

 let datosLibro = peticion.body;
 const nuevoLibro = await Libro.create(datosLibro);
 respuesta.status(201).json({ mensaje: "Libro registrado con éxito", libro: nuevoLibro });
 } catch (error) {
 console.error("Error al registrar libro:", error);
 respuesta.status(500).json({ mensaje: "Error registrando libro", error: error.message });
 }
 }

 async buscarLibros(peticion, respuesta) {
 try {
 const libros = await Libro.findAll({
 include: [
 { model: Usuario, as: 'Usuario' },
 { model: Reseña, as: 'Reseñas' },
 { model: Transaccion, as: 'Transacciones' }
 ]
 });
 respuesta.status(200).json({ mensaje: "Libros encontrados", datos: libros });
 } catch (error) {
 console.error("Error al buscar libros:", error);
 respuesta.status(500).json({ mensaje: "Error buscando libros", error: error.message });
 }
 }

 async buscarLibroPorId(peticion, respuesta) {
 try {
 let id = peticion.params.idLibro;
 const libro = await Libro.findByPk(id, {
 include: [
 { model: Usuario, as: 'Usuario' },
 { model: Reseña, as: 'Reseñas' },
 { model: Transaccion, as: 'Transacciones' }
 ]
 });
 if (!libro) {
 return respuesta.status(404).json({ mensaje: "Libro no encontrado" });
 }
 respuesta.status(200).json({ mensaje: "Libro encontrado", datos: libro });
 } catch (error) {
 console.error("Error al buscar libro por ID:", error);
 respuesta.status(500).json({ mensaje: "Error buscando libro", error: error.message });
 }
 }

 async editarLibro(peticion, respuesta) {
 try {
 let id = peticion.params.idLibro;
 let datos = peticion.body;
 const libroActualizado = await Libro.update(datos, {
 where: { id: id }
 });
 if (libroActualizado[0] === 0) {
 return respuesta.status(404).json({ mensaje: "Libro no encontrado" });
 }
 const libroObtenido = await Libro.findByPk(id, {
 include: [
 { model: Usuario, as: 'Usuario' },
 { model: Reseña, as: 'Reseñas' },
 { model: Transaccion, as: 'Transacciones' }
 ]
 });
 respuesta.status(200).json({ mensaje: "Libro editado con éxito", libro: libroObtenido });
 } catch (error) {
 console.error("Error al editar libro:", error);
 respuesta.status(500).json({ mensaje: "Error editando libro", error: error.message });
 }
 }

 async eliminarLibro(peticion, respuesta) {
 try {
 let id = peticion.params.idLibro;
 const libroEliminado = await Libro.destroy({
 where: { id: id }
 });
 if (libroEliminado === 0) {
 return respuesta.status(404).json({ mensaje: "Libro no encontrado" });
 }
 respuesta.status(200).json({ mensaje: "Libro eliminado" });
 } catch (error) {
 console.error("Error al eliminar libro:", error);
 respuesta.status(500).json({ mensaje: "Error eliminando libro", error: error.message });
 }
 }
}