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
 
 export class ControladorTransacciones {
  constructor() {}
 
  async crearTransaccionCompra(peticion, respuesta) {
  try {
  const errores = validationResult(peticion);
  if (!errores.isEmpty()) {
  return respuesta.status(400).json({ errores: errores.array() });
  }
 
  const { comprador_id, vendedor_id, libro_id, metodo_pago } = peticion.body;
 
  const nuevaTransaccion = await Transaccion.create({
  tipo: 'compra',
  comprador_id,
  vendedor_id,
  libro_id,
  estado: 'completada',
  metodo_pago
  });
 
  const transaccionCompleta = await Transaccion.findByPk(nuevaTransaccion.id, {
  include: [
  { model: Libro, as: 'Libro' },
  { model: Usuario, as: 'Comprador' },
  { model: Usuario, as: 'Vendedor' }
  ]
  });
 
  respuesta.status(201).json({ mensaje: "Transacción de compra creada con éxito", transaccion: transaccionCompleta });
  } catch (error) {
  console.error("Error al crear transacción de compra:", error);
  respuesta.status(500).json({ mensaje: "Error creando transacción de compra", error: error.message });
  }
  }
 
  async crearTransaccionIntercambio(peticion, respuesta) {
  try {
  const errores = validationResult(peticion);
  if (!errores.isEmpty()) {
  return respuesta.status(400).json({ errores: errores.array() });
  }
 
  const { comprador_id, vendedor_id, libro_id } = peticion.body;
 
  const nuevaTransaccion = await Transaccion.create({
  tipo: 'intercambio',
  comprador_id,
  vendedor_id,
  libro_id,
  estado: 'pendiente'
  });
 
  const transaccionCompleta = await Transaccion.findByPk(nuevaTransaccion.id, {
  include: [
  { model: Libro, as: 'Libro' },
  { model: Usuario, as: 'Comprador' },
  { model: Usuario, as: 'Vendedor' }
  ]
  });
 
  respuesta.status(201).json({ mensaje: "Transacción de intercambio creada con éxito", transaccion: transaccionCompleta });
  } catch (error) {
  console.error("Error al crear transacción de intercambio:", error);
  respuesta.status(500).json({ mensaje: "Error creando transacción de intercambio", error: error.message });
  }
  }
 
  async obtenerTransacciones(peticion, respuesta) {
  try {
  const transacciones = await Transaccion.findAll({
  include: [
  { model: Libro, as: 'Libro' },
  { model: Usuario, as: 'Comprador' },
  { model: Usuario, as: 'Vendedor' }
  ],
  order: [['fecha', 'DESC']]
  });
  respuesta.status(200).json(transacciones);
  } catch (error) {
  console.error("Error al obtener transacciones:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo transacciones", error: error.message });
  }
  }
 
  async obtenerTransaccionPorId(peticion, respuesta) {
  try {
  const transaccionId = peticion.params.idTransaccion;
  const transaccion = await Transaccion.findByPk(transaccionId, {
  include: [
  { model: Libro, as: 'Libro' },
  { model: Usuario, as: 'Comprador' },
  { model: Usuario, as: 'Vendedor' }
  ]
  });
  if (!transaccion) {
  return respuesta.status(404).json({ mensaje: "Transacción no encontrada" });
  }
  respuesta.status(200).json(transaccion);
  } catch (error) {
  console.error("Error al obtener transacción por ID:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo transacción", error: error.message });
  }
  }
 
  async actualizarEstadoTransaccion(peticion, respuesta) {
  try {
  const transaccionId = peticion.params.idTransaccion;
  const { estado, recibo } = peticion.body;
 
  const transaccionActualizada = await Transaccion.update(
  { estado, recibo },
  { where: { id: transaccionId } }
  );
 
  if (transaccionActualizada[0] === 0) {
  return respuesta.status(404).json({ mensaje: "Transacción no encontrada" });
  }
 
  const transaccionObtenida = await Transaccion.findByPk(transaccionId, {
  include: [
  { model: Libro, as: 'Libro' },
  { model: Usuario, as: 'Comprador' },
  { model: Usuario, as: 'Vendedor' }
  ]
  });
 
  respuesta.status(200).json({ mensaje: "Estado de transacción actualizado con éxito", transaccion: transaccionObtenida });
  } catch (error) {
  console.error("Error al actualizar estado de transacción:", error);
  respuesta.status(500).json({ mensaje: "Error actualizando estado de transacción", error: error.message });
  }
  }
 
  async eliminarTransaccion(peticion, respuesta) {
  try {
  const transaccionId = peticion.params.idTransaccion;
  const resultado = await Transaccion.destroy({ where: { id: transaccionId } });
 
  if (resultado === 0) {
  return respuesta.status(404).json({ mensaje: "Transacción no encontrada" });
  }
 
  respuesta.status(200).json({ mensaje: "Transacción eliminada con éxito" });
  } catch (error) {
  console.error("Error al eliminar transacción:", error);
  respuesta.status(500).json({ mensaje: "Error eliminando transacción", error: error.message });
  }
  }
 
  async obtenerTransaccionesPorUsuario(peticion, respuesta) {
  try {
  const usuarioId = peticion.params.idUsuario;
  const transacciones = await Transaccion.findAll({
  where: {
  [Sequelize.Op.or]: [{ comprador_id: usuarioId }, { vendedor_id: usuarioId }]
  },
  include: [
  { model: Libro, as: 'Libro' },
  { model: Usuario, as: 'Comprador' },
  { model: Usuario, as: 'Vendedor' }
  ],
  order: [['fecha', 'DESC']]
  });
  respuesta.status(200).json(transacciones);
  } catch (error) {
  console.error("Error al obtener transacciones por usuario:", error);
  respuesta.status(500).json({ mensaje: "Error obteniendo transacciones por usuario", error: error.message });
  }
  }
 }