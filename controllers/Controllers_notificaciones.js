import { validationResult } from 'express-validator';
 import {
  Usuario,
  Libro,
  Resena,
  Transaccion,
  Mensaje,
  Notificacion
 } from '../models/index.js';
 
 export class ControladorNotificaciones {
  constructor() {}
 
  async crearNotificacion(peticion, respuesta) {
  try {
  const errores = validationResult(peticion);
  if (!errores.isEmpty()) {
  return respuesta.status(400).json({ errores: errores.array() });
  }
 
  const nuevaNotificacion = await Notificacion.create(peticion.body);
  respuesta.status(201).json({ mensaje: "Notificación creada con éxito", notificacion: nuevaNotificacion });
  } catch (error) {
  console.error("Error al crear notificación:", error);
  respuesta.status(500).json({ mensaje: "Error creando notificación", error: error.message });
  }
  }
 
  async obtenerNotificacionesPorUsuario(peticion, respuesta) {
  try {
  const usuarioId = peticion.params.idUsuario;
  const notificaciones = await Notificacion.findAll({
  where: { usuario_id: usuarioId },
  include: [{ model: Usuario, as: 'usuario' }],
  order: [['fecha', 'DESC']]
  });
  respuesta.status(200).json(notificaciones);
  } catch (error) {
  console.error("Error al obtener notificaciones:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo notificaciones", error: error.message });
  }
  }
 
  async obtenerNotificacionPorId(peticion, respuesta) {
  try {
  const notificacionId = peticion.params.idNotificacion;
  const notificacion = await Notificacion.findByPk(notificacionId, {
  include: [{ model: Usuario, as: 'usuario' }]
  });
  if (!notificacion) {
  return respuesta.status(404).json({ mensaje: "Notificación no encontrada" });
  }
  respuesta.status(200).json(notificacion);
  } catch (error) {
  console.error("Error al obtener notificación por ID:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo notificación", error: error.message });
  }
  }
 
  async actualizarNotificacion(peticion, respuesta) {
  try {
  const notificacionId = peticion.params.idNotificacion;
  const { tipo, contenido, leida } = peticion.body;
 
  const notificacionActualizada = await Notificacion.update(
  { tipo, contenido, leida },
  { where: { id: notificacionId } }
  );
 
  if (notificacionActualizada[0] === 0) {
  return respuesta.status(404).json({ mensaje: "Notificación no encontrada" });
  }
 
  const notificacionObtenida = await Notificacion.findByPk(notificacionId, {
  include: [{ model: Usuario, as: 'usuario' }]
  });
 
  respuesta.status(200).json({ mensaje: "Notificación actualizada con éxito", notificacion: notificacionObtenida });
  } catch (error) {
  console.error("Error al actualizar notificación:", error);
  respuesta.status(500).json({ mensaje: "Error actualizando notificación", error: error.message });
  }
  }
 
  async eliminarNotificacion(peticion, respuesta) {
  try {
  const notificacionId = peticion.params.idNotificacion;
  const resultado = await Notificacion.destroy({ where: { id: notificacionId } });
 
  if (resultado === 0) {
  return respuesta.status(404).json({ mensaje: "Notificación no encontrada" });
  }
 
  respuesta.status(200).json({ mensaje: "Notificación eliminada con éxito" });
  } catch (error) {
  console.error("Error al eliminar notificación:", error);
  respuesta.status(500).json({ mensaje: "Error eliminando notificación", error: error.message });
  }
  }
 }