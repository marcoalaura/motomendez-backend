/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import logger from './../../../lib/logger';
import handlebars from 'handlebars';
import util from '../../../lib/util';
import config from '../../../config/config';

module.exports = (app) => {
  const _app = app;
  const PlantillaModel = app.src.db.models.plantilla;
  const UsuarioModel = app.src.db.models.usuario;
  const PersonaModel = app.src.db.models.persona;
  const RolModel = app.src.db.models.rol;
  const UsuarioRolModel = app.src.db.models.usuario_rol;
  const DpaModel = app.src.db.models.dpa;

  const crearRegistro = async (req, res) => {
    try {
      const plantilla = await PlantillaModel.findOne({ where: { nombre: 'SOPORTE' } });
      const template = handlebars.compile(plantilla.contenido);
      const dataUsuario = await UsuarioModel.buscarIncluyeOne(req.body.audit_usuario.id_usuario, PersonaModel, UsuarioRolModel, RolModel, DpaModel);
      const data = {
        nombre: dataUsuario.persona.nombre_completo,
        correo: dataUsuario.email,
        municipio: dataUsuario.dpa.municipio,
        incidente: req.body.incidente,
        descripcion: req.body.descripcion,
      };
      const configuracion = config();
      const correoSoporte = configuracion.correoSoporte;

      const correoEnviar = {
        remitente: plantilla.remitente,
        origen: plantilla.origen,
        modo: 'html',
        mensaje: template(data),
        correos: correoSoporte,
        asunto: plantilla.asunto,
      };
      util.enviar(correoEnviar);

      res.status(201).json({
        finalizado: true,
        mensaje: 'Solicitud enviada correctamente.',
        datos: {},
      });
    } catch (error) {
      logger.error('[soporte.controller][crearRegistro]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.soporte = {
    crearRegistro,
  };
};
