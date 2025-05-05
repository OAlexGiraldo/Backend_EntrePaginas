import { validationResult } from 'express-validator';
 import {
  Usuario,
  Libro,
  Resena,
  Transaccion,
  Mensaje,
  Notificacion
 } from '../models/index.js';
 
 export class ControladorMensajes {
  constructor() {}
 
  async crearMensaje(peticion, respuesta) {
  try {
  const errores = validationResult(peticion);
  if (!errores.isEmpty()) {
  return respuesta.status(400).json({ errores: errores.array() });
  }
 
  const nuevoMensaje = await Mensaje.create(peticion.body);
  respuesta.status(201).json({ mensaje: "Mensaje creado con éxito", mensaje: nuevoMensaje });
  } catch (error) {
  console.error("Error al crear mensaje:", error);
  respuesta.status(500).json({ mensaje: "Error creando mensaje", error: error.message });
  }
  }
 
  async obtenerMensajesPorReceptor(peticion, respuesta) {
  try {
  const receptorId = peticion.params.idReceptor;
  const mensajes = await Mensaje.findAll({
  where: { receptor_id: receptorId },
  include: [{ model: Usuario, as: 'emisor' }], // Incluir información del emisor
  order: [['fecha', 'DESC']]
  });
  respuesta.status(200).json(mensajes);
  } catch (error) {
  console.error("Error al obtener mensajes:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo mensajes", error: error.message });
  }
  }
 
  async obtenerMensajePorId(peticion, respuesta) {
  try {
  const mensajeId = peticion.params.idMensaje;
  const mensaje = await Mensaje.findByPk(mensajeId, {
  include: [{ model: Usuario, as: 'emisor' }, { model: Usuario, as: 'receptor' }]
  });
  if (!mensaje) {
  return respuesta.status(404).json({ mensaje: "Mensaje no encontrado" });
  }
  respuesta.status(200).json(mensaje);
  } catch (error) {
  console.error("Error al obtener mensaje por ID:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo mensaje", error: error.message });
  }
  }
 
  async actualizarMensaje(peticion, respuesta) {
  try {
  const mensajeId = peticion.params.idMensaje;
  const { mensaje } = peticion.body;
 
  const mensajeActualizado = await Mensaje.update(
  { mensaje: mensaje },
  { where: { id: mensajeId } }
  );
 
  if (mensajeActualizado[0] === 0) {
  return respuesta.status(404).json({ mensaje: "Mensaje no encontrado" });
  }
 
  const mensajeObtenido = await Mensaje.findByPk(mensajeId, {
  include: [{ model: Usuario, as: 'emisor' }, { model: Usuario, as: 'receptor' }]
  });
 
  respuesta.status(200).json({ mensaje: "Mensaje actualizado con éxito", mensaje: mensajeObtenido });
  } catch (error) {
  console.error("Error al actualizar mensaje:", error);
  respuesta.status(500).json({ mensaje: "Error actualizando mensaje", error: error.message });
  }
  }
 
  async eliminarMensaje(peticion, respuesta) {
  try {
  const mensajeId = peticion.params.idMensaje;
  const resultado = await Mensaje.destroy({ where: { id: mensajeId } });
 
  if (resultado === 0) {
  return respuesta.status(404).json({ mensaje: "Mensaje no encontrado" });
  }
 
  respuesta.status(200).json({ mensaje: "Mensaje eliminado con éxito" });
  } catch (error) {
  console.error("Error al eliminar mensaje:", error);
  respuesta.status(500).json({ mensaje: "Error eliminando mensaje", error: error.message });
  }
  }
 }