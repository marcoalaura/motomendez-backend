/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
/* eslint radix: ["error", "as-needed"] */

import logger from '../../../lib/logger';
import moment from 'moment';

module.exports = (app) => {
  const _app = app;
  const controlCorte = async (req, res) => {
    try {
      const gestion = req.query.gestion;
      // const mes = req.query.mes;
      const idUsuario = req.body.audit_usuario.id_usuario;
      logger.info('[controlCorte.controller][controlCorte] %s %d %d', 'Consulta control de corte mensual para ->', gestion);
      const resCorteMensual = await app.dao.corte.controlCorte(idUsuario, gestion);
      if (resCorteMensual[0].corte_mensual === 'Ok') {
        logger.info('[controlCorte.controller][controlCorte]', 'Se realizo el control de corte mensual con exito ->', resCorteMensual[0].corte_mensual);

        res.status(200).json({
          finalizado: true,
          mensaje: 'Control corte realizado con éxito.',
          datos: {},
        });
      } else {
        throw new Error(resCorteMensual[0].corte_mensual);
      }
    } catch (error) {
      logger.error('[controlCorte.controller][controlCorte]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listaControlCorte = async (req, res) => {
    try {
      if (!req.query.tipo) {
        throw new Error('El parámetro tipo es requerido.');
      }
      const tipo = req.query.tipo;
      const gestion = req.query.gestion ? req.query.gestion : null;
      logger.info('[controlCorte.controller][controlCorte] %s ', 'Lista de registro control_corte', tipo, gestion);
      const lista = await app.dao.controlCorte.listaControlCorte(tipo, gestion);
      res.status(200).json({
        finalizado: true,
        mensaje: 'Listado exitoso',
        datos: lista,
      });
    } catch (e) {
      logger.error('[controlCorte.controller][listaControlCorte]', 'error ->', e.message);
      res.status(412).json({
        finalizado: false,
        mensaje: e.message,
        datos: {},
      });
    }
  };

  const habilitarControlCorte = async (req, res) => {
    const tipo = req.body.tipo ? req.body.tipo : 'MENSUAL';
    const gestion = moment().format('YYYY');
    const mes = tipo === 'MENSUAL' ? moment().format('M') : null;
    try {
      logger.info('[controlCorte.controller][habilitarCorteMensual] %s, %s', gestion, mes);
      const parametros = { gestion, mes, tipo_corte: tipo };
      const respuesta = await app.dao.controlCorte.detalleControlCorte(parametros);
      if (respuesta) {
        throw new Error(`Ya esta habilitado el corte mensual para la gestión ${gestion} y el mes ${mes}.`);
      }
      const registroCreado = await app.dao.controlCorte.crearRegistroControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, tipo);
      res.status(200).json({
        finalizado: true,
        mensaje: 'Registro creado exitosamente.',
        datos: registroCreado,
      });
    } catch (e) {
      logger.error('[controlCorte.controller][habilitarCorteMensual]', 'error ->', e.message);
      res.status(412).json({
        finalizado: false,
        mensaje: e.message,
        datos: {},
      });
    }
  };

  const corteAnual = async (req, res) => {
    try {
      res.status(200).json({
        finalizado: true,
        mensaje: 'Control corte realizado con éxito.',
        datos: {},
      });
    } catch (error) {
      logger.error('[controlCorte.controller][controlCorte]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const actualizaPasoControlCorte = async (usuario, gestion, mes, tipo, orden, validador) => {
    const parametros = { gestion, mes, tipo_corte: tipo };
    try {
      const controlCorteDetalle = await app.dao.controlCorte.detalleControlCorte(parametros);
      if (!controlCorteDetalle) {
        return false;
      } else if (controlCorteDetalle.estado === 'FINALIZADO') {
        return false;
      }

      const idControl = controlCorteDetalle.id_control_corte;
      const pasos = JSON.parse(controlCorteDetalle.pasos);
      const longitudPasos = pasos.length;
      const posicion = pasos.findIndex(item => item.orden === orden);
      const dataUpdate = { _usuario_modificacion: usuario };
      let respValidacion = false;
      if (pasos[posicion].estado === 'EJECUCION') {
        // llamar funcion de validacion
        const respValidacionFn = await app.dao.controlCorte.consultaEstadoPaso(pasos[posicion].paso, tipo, gestion, mes); // debe devolver true o false
        respValidacion = respValidacionFn[0].estado_paso === 'true';
        if (validador && respValidacion) {
          pasos[posicion].estado = 'FINALIZADO';
          if (orden > 0 && orden < longitudPasos) {
            pasos[posicion + 1].estado = 'HABILITADO';
          }
        } else {
          pasos[posicion].estado = 'HABILITADO';
          dataUpdate.estado = 'PENDIENTE';
        }

        dataUpdate.pasos = JSON.stringify(pasos);
        await app.dao.controlCorte.actualizarPasosControlCorte(idControl, dataUpdate);
      }

      if (respValidacion && orden === longitudPasos && pasos[posicion].estado === 'FINALIZADO') {
        const controlUpdate = {
          _usuario_modificacion: usuario,
          estado: 'FINALIZADO',
        };
        await app.dao.controlCorte.actualizarPasosControlCorte(idControl, controlUpdate);
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const actualizarControlCorte = async (req, res) => {
    const tipo = req.body.tipo ? req.body.tipo : 'MENSUAL';
    const gestion = moment().format('YYYY');
    const mes = tipo === 'MENSUAL' ? moment().format('M') : null;
    const idControlCorte = req.params.id;

    try {
      if (!req.body.orden) {
        throw new Error('El parámetro orden es requerido.');
      }
      const { orden } = req.body;

      const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
        const parametros = { id_control_corte: idControlCorte, gestion, mes, tipo_corte: tipo };
        const controlCorteDetalle = await app.dao.controlCorte.detalleControlCorte(parametros);
        if (!controlCorteDetalle) {
          throw new Error('No existe el registro a modificar.');
        }

        const idControl = controlCorteDetalle.id_control_corte;
        const pasos = JSON.parse(controlCorteDetalle.pasos);
        const posicion = pasos.findIndex(item => item.orden === orden);

        if (!['HABILITADO'].includes(pasos[posicion].estado)) {
          throw new Error('No puede realizar modificaciones.');
        }

        const dataUpdate = { _usuario_modificacion: req.body.audit_usuario.id_usuario };
        pasos[posicion].estado = 'EJECUCION';
        dataUpdate.pasos = JSON.stringify(pasos);
        await app.dao.controlCorte.actualizarPasosControlCorte(idControl, dataUpdate);
      });

      if (transaccion.finalizado) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'La ejecucion del proceso ha finalizado correctamente.',
          datos: {},
        });
      } else {
        throw new Error(transaccion.mensaje);
      }
    } catch (e) {
      logger.error('[controlCorte.controller][validador]', 'error ->', e.message);
      res.status(412).json({
        finalizado: false,
        mensaje: e.message || 'Se ha producido un error mientras se ejecutaba el preceso',
      });
    }
  };

  const detalleControlCorte = async (req, res) => {
    const tipo = req.query.tipo ? req.query.tipo : 'MENSUAL';
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    const mes = tipo === 'MENSUAL' ? moment().format('M') : null;

    try {
      if (!req.query.tipo) {
        throw new Error('El parámetro tipo es requerido.');
      }
      logger.info('[controlCorte.controller][detalle] %s, %s', 'Detalle indivudual de control_corte', gestion, mes);
      const parametros = { gestion, mes, tipo_corte: tipo };
      const detalle = await app.dao.controlCorte.detalleControlCorte(parametros);
      res.status(200).json({
        finalizado: true,
        mensaje: 'Obtención de detalles exitoso',
        datos: detalle,
      });
    } catch (e) {
      logger.error('[controlCorte.controller][listaControlCorte]', 'error ->', e.message);
      res.status(412).json({
        finalizado: false,
        mensaje: e.message,
        datos: {},
      });
    }
  };

  _app.controller.controlCorte = {
    listaControlCorte,
    controlCorte,
    habilitarControlCorte,
    actualizaPasoControlCorte,
    actualizarControlCorte,
    corteAnual,
    detalleControlCorte,
  };
};
