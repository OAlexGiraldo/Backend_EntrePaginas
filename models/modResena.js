// models/modResena.js
import { DataTypes } from 'sequelize';
import sequelize from '../Database/conexion.js';

const Resena = sequelize.define('Resena', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  libro_id: { type: DataTypes.INTEGER, allowNull: false },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comentario: { type: DataTypes.TEXT, allowNull: true },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'Resena',
  timestamps: false
});
export default Resena;




  