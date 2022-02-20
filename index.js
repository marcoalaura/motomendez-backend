import express from 'express';
import consign from 'consign';
import bodyParser from 'body-parser';

global._path = __dirname;

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // El proveedor del servicio de salud no es muy reconocido, la actualización del mismo dio problemas

console.log('inicio');
consign()
  .include('src/lib/middleware_log.js')
  .then('src/config/config.js')
  .then('src/lib/util.js')
  .then('src/db.js')
  .then('src/auth.js')
  .then('src/lib/middlewares.js')
  .then('src/modulos')
  .then('src/lib/boot.js')
  .into(app);
module.exports = app;
