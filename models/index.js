// models/index.js
import Usuario from './modUsuario.js';
import Libro from './modLibro.js';
import Reseña from './modResena.js';
import Transaccion from './modTransaccion.js';
import Mensaje from './modMensajes.js';
import Notificacion from './modNotificaciones.js';

// Asociaciones
Usuario.hasMany(Libro, { foreignKey: 'usuario_id' });
Libro.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Reseña, { foreignKey: 'usuario_id' });
Reseña.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Libro.hasMany(Reseña, { foreignKey: 'libro_id' });
Reseña.belongsTo(Libro, { foreignKey: 'libro_id' });

Usuario.hasMany(Transaccion, { foreignKey: 'comprador_id', as: 'compras' });
Usuario.hasMany(Transaccion, { foreignKey: 'vendedor_id', as: 'ventas' });
Transaccion.belongsTo(Usuario, { foreignKey: 'comprador_id', as: 'comprador' });
Transaccion.belongsTo(Usuario, { foreignKey: 'vendedor_id', as: 'vendedor' });
Libro.hasMany(Transaccion, { foreignKey: 'libro_id' });
Transaccion.belongsTo(Libro, { foreignKey: 'libro_id' });

Usuario.hasMany(Mensaje, { foreignKey: 'emisor_id', as: 'mensajesEnviados' });
Usuario.hasMany(Mensaje, { foreignKey: 'receptor_id', as: 'mensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'emisor_id', as: 'emisor' });
Mensaje.belongsTo(Usuario, { foreignKey: 'receptor_id', as: 'receptor' });

Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export {
  Usuario,
  Libro,
  Reseña,
  Transaccion,
  Mensaje,
  Notificacion
};





