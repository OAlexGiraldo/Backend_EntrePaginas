// models/modLibro.js
import { DataTypes } from 'sequelize';
import sequelize from '../Database/conexion.js';
import Transaccion from './modTransaccion.js';

const Libro = sequelize.define('Libro', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING },
  autor: { type: DataTypes.STRING },
  precio: { type: DataTypes.FLOAT },
  imagen: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'libros',
  timestamps: false
});
// Relación con Transaccion
Libro.hasMany(Transaccion, { foreignKey: 'libro_id' });
export default Libro;




  