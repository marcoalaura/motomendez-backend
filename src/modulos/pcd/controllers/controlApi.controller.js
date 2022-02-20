import arrayPasos from '../../../config/array-pasos.json';
import arrayPasosMensual from '../../../config/array-pasos-mensual.json';
import logger from '../../../lib/logger';
import moment from 'moment';

module.exports = (app) => {
  const _app = app;

  const actualizaPasoControlApi = async (usuario, tipo, orden, etapa) => {
    const parametros = { tipo_corte: tipo, orden };
    try {
      const controlApiDetalle = await app.dao.controlApi.detalleControlApi(parametros);
      const idControl = controlApiDetalle ? controlApiDetalle.id_control_api : null;
      const controlUpdate = {
        _usuario_modificacion : usuario,
      };

      if (idControl) {
        if (controlApiDetalle.estado === 'EJECUCION' && etapa === 'INICIAR') {
          return false;
        }
      } else {
        const pasos = tipo === 'ANUAL' ? arrayPasos : arrayPasosMensual;
        const posicion = pasos.findIndex(item => item.orden === orden);
        controlUpdate._usuario_creacion = usuario;
        controlUpdate.tipo_corte = tipo;
        controlUpdate.orden = orden;
        controlUpdate.paso = pasos[posicion].paso;
      }

      if (etapa === 'INICIAR') controlUpdate.estado = 'EJECUCION';
      if (etapa === 'FINALIZAR') controlUpdate.estado = 'HABILITADO';
      if (etapa === 'FALLAR') controlUpdate.estado = 'HABILITADO';
      await app.dao.controlApi.actualizarPasosControlApi(idControl, controlUpdate);

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

  _app.controller.controlApi = {
    actualizaPasoControlApi,
    actualizarControlCorte,
    detalleControlCorte,
  };
};
