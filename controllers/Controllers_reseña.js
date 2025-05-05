import { validationResult } from 'express-validator';
 import {
  Usuario,
  Libro,
  Resena,
  Transaccion,
  Mensaje,
  Notificacion
 } from '../models/index.js';
 import { Sequelize } from 'sequelize';
 
 export class ControladorResenas {
  constructor() {}
 
  async crearResena(peticion, respuesta) {
  try {
  const errores = validationResult(peticion);
  if (!errores.isEmpty()) {
  return respuesta.status(400).json({ errores: errores.array() });
  }
 
  const { usuario_id, calificacion, comentario } = peticion.body;
  const libro_id = peticion.params.idLibro;
 
  const nuevaResena = await Resena.create({
  usuario_id,
  libro_id,
  calificacion,
  comentario
  });
 
  const resenaCompleta = await Resena.findByPk(nuevaResena.id, {
  include: [{ model: Usuario, as: 'usuario' }]
  });
 
  respuesta.status(201).json({ mensaje: "Reseña creada con éxito", resena: resenaCompleta });
  } catch (error) {
  console.error("Error al crear reseña:", error);
  respuesta.status(500).json({ mensaje: "Error creando reseña", error: error.message });
  }
  }
 
  async obtenerResenasPorLibro(peticion, respuesta) {
  try {
  const libro_id = peticion.params.idLibro;
  const resenas = await Resena.findAll({
  where: { libro_id: libro_id },
  include: [{ model: Usuario, as: 'usuario' }],
  order: [['fecha', 'DESC']]
  });
  respuesta.status(200).json(resenas);
  } catch (error) {
  console.error("Error al obtener reseñas:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo reseñas", error: error.message });
  }
  }
 
  async obtenerResenaPorId(peticion, respuesta) {
  try {
  const resenaId = peticion.params.idResena;
  const resena = await Resena.findByPk(resenaId, {
  include: [{ model: Usuario, as: 'usuario' }, { model: Libro, as: 'libro' }]
  });
  if (!resena) {
  return respuesta.status(404).json({ mensaje: "Reseña no encontrada" });
  }
  respuesta.status(200).json(resena);
  } catch (error) {
  console.error("Error al obtener reseña por ID:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo reseña", error: error.message });
  }
  }
 
  async actualizarResena(peticion, respuesta) {
  try {
  const resenaId = peticion.params.idResena;
  const { calificacion, comentario } = peticion.body;
 
  const resenaActualizada = await Resena.update(
  { calificacion, comentario },
  { where: { id: resenaId } }
  );
 
  if (resenaActualizada[0] === 0) {
  return respuesta.status(404).json({ mensaje: "Reseña no encontrada" });
  }
 
  const resenaObtenida = await Resena.findByPk(resenaId, {
  include: [{ model: Usuario, as: 'usuario' }, { model: Libro, as: 'libro' }]
  });
 
  respuesta.status(200).json({ mensaje: "Reseña actualizada con éxito", resena: resenaObtenida });
  } catch (error) {
  console.error("Error al actualizar reseña:", error);
  respuesta.status(500).json({ mensaje: "Error actualizando reseña", error: error.message });
  }
  }
 
  async eliminarResena(peticion, respuesta) {
  try {
  const resenaId = peticion.params.idResena;
  const resultado = await Resena.destroy({ where: { id: resenaId } });
 
  if (resultado === 0) {
  return respuesta.status(404).json({ mensaje: "Reseña no encontrada" });
  }
 
  respuesta.status(200).json({ mensaje: "Reseña eliminada con éxito" });
  } catch (error) {
  console.error("Error al eliminar reseña:", error);
  respuesta.status(500).json({ mensaje: "Error eliminando reseña", error: error.message });
  }
  }
 
  async calcularPromedioCalificaciones(peticion, respuesta) {
  try {
  const libro_id = peticion.params.idLibro;
 
  const resultado = await Resena.findAll({
  attributes: [[Sequelize.fn('AVG', Sequelize.col('calificacion')), 'promedioCalificacion']],
  where: { libro_id: libro_id },
  raw: true
  });
 
  const promedio = resultado[0].promedioCalificacion || 0;
  respuesta.status(200).json({ promedioCalificacion: parseFloat(promedio.toFixed(2)) });
  } catch (error) {
  console.error("Error al calcular promedio:", error);
  respuesta.status(500).json({ mensaje: "Error calculando promedio", error: error.message });
  }
  }
 }