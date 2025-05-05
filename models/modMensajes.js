// models/Mensaje.js
import { DataTypes } from 'sequelize';
import sequelize from '../Database/conexion.js';
const Mensaje = sequelize.define('Mensaje', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  emisor_id: { 
    type: DataTypes.INTEGER, 
    references: { model: 'usuarios', key: 'id' }
  },
  receptor_id: { 
    type: DataTypes.INTEGER, 
    references: { model: 'usuarios', key: 'id' }
  },
  mensaje: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  fecha: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'mensajes',
  timestamps: false
});
export default Mensaje;
