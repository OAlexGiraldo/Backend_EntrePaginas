// En tu archivo ServidorAPI.js (o Servidor.js)
import express from 'express';
import rutasPersonalizadas from './routers/router.js'; // Asegúrate de que la ruta sea correcta
import sequelize from './Database/conexion.js';
import cors from 'cors';

console.log("ServidorAPI.js: Inicio del archivo");

export class ServidorAPI {
  constructor() {
    console.log("ServidorAPI.js: Constructor");
    this.app = express();
    this.conectarConBD();
    this.activarbody();
    this.atenderPeticiones();
    console.log("ServidorAPI.js: Constructor finalizado");
  }

  despertarServidor() {
    this.app.listen(process.env.PORT, function () {
      console.log("ServidorAPI.js: Éxito encendiendo el servidor en puerto " + process.env.PORT);
    });
  }

  atenderPeticiones() {
    console.log("ServidorAPI.js: Atendiendo peticiones en la ruta '/'");
    this.app.use('/', rutasPersonalizadas);
    console.log("ServidorAPI.js: Middleware de rutas configurado");
  }

  async conectarConBD() {
    console.log("ServidorAPI.js: Intentando conectar a la base de datos");
    try {
      await sequelize.authenticate();
      console.log('ServidorAPI.js: Conexión a la base de datos MySQL establecida con éxito.');
      await sequelize.sync({ force: false }); // Crea las tablas si no existen (dev false para no borrarlas)
      console.log('ServidorAPI.js: Base de datos sincronizada.');
    } catch (error) {
      console.error('ServidorAPI.js: Error al conectar con la base de datos:', error);
    }
    console.log("ServidorAPI.js: Finalizada la conexión a la base de datos");
  }

  activarbody() {
    console.log("ServidorAPI.js: Activando middlewares de body (cors y json)");
    this.app.use(cors());
    this.app.use(express.json());
    console.log("ServidorAPI.js: Middlewares de body activados");
  }
}

const servidor = new ServidorAPI();
servidor.despertarServidor();

console.log("ServidorAPI.js: Fin del archivo");