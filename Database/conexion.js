// Conexión Base de datos (conexion.js)
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno desde .env

const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_USER,
 process.env.DB_PASSWORD,
 {
 host: process.env.DB_HOST || 'localhost',
 port: process.env.DB_PORT || 3306,
 dialect: 'mysql'
 }
);

export default sequelize;
