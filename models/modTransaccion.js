// models/modTransaccion.js
import { DataTypes } from 'sequelize';
import sequelize from '../Database/conexion.js';

const Transaccion = sequelize.define('Transaccion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tipo: { type: DataTypes.ENUM('compra', 'intercambio'), allowNull: false },
  comprador_id: { type: DataTypes.INTEGER, allowNull: false },
  vendedor_id: { type: DataTypes.INTEGER, allowNull: false },
  libro_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado: { type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'), allowNull: false },
  recibo: { type: DataTypes.TEXT },
  metodo_pago: { type: DataTypes.ENUM('virtual', 'intercambio') }
}, {
  tableName: 'transacciones',
  timestamps: false
});
export default Transaccion;
