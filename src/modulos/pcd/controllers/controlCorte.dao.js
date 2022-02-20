import arrayPasos from '../../../config/array-pasos.json';
import arrayPasosMensual from '../../../config/array-pasos-mensual.json';
import moment from 'moment';
import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;
  const ControlCorte = app.src.db.models.control_corte;

  // -------------- listado y manejo de la tabla control_corte --------------
  /**
   * Devuelve la lista de registros en la tabla control_corte
   * @param {string} tipo
   * @param {string} gestion
   */
  const listaControlCorte = (tipo, gestion) => {
    const query = {
      order: 'id_control_corte',
      where: { tipo_corte: tipo },
    };
    if (gestion) {
      query.where.gestion = gestion;
    }
    return ControlCorte.findAll(query);
  };

  /**
   * Devuelve detalles de control corte segun id_control_corte
   * @param {string} gestion
   */
  const detalleControlCorte = (where) => {
    const query = { where };
    return ControlCorte.findOne(query);
  };


    /**
   * Devuelve detalles de control corte segun id_control_corte
   * @param {string} gestion
   */
  const detalleControlCortePorId = (tipo, idControlCorte) => {
    const query = { where: {
      tipo_corte: tipo,
      id_control_corte: idControlCorte,
    } };
    return ControlCorte.findOne(query);
  };

  // ------------- pasos para el flujo de corte -------------
  /**
  * realizarCorte - Método para realizar el corte anual
  * @param {number} idUsuario
  * @param {number} gestion
  */
  const realizarCorteAnual = (idUsuario, gestion) => {
    const query = `select fn_corte_anual(${idUsuario}, ${gestion}) as corte_anual`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * realizarArmadoSigep - Método que verifica arma los datos para sigep segun corte_anual
   * @param {number} idUsuario
   * @param {number} gestion
   */
  const realizarArmadoSigep = (idUsuario, gestion) => {
    const query = `select fn_armar_sigep(${idUsuario}, ${gestion}) as armado_sigep`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * Crear un registro control_corte
   * @param {int} idUsuario
   * @param {string} gestion
   * @param {string} mes
   * @param {string} tipo
   */
  const crearRegistroControlCorte = async (idUsuario, gestion, mes, tipo) => {
    const { fechaInicio, fechaFin } = util.ragoFechas(null, null);
    // Reemplazamos variables preconfiguradas
    let pasos = tipo === 'ANUAL' ? JSON.stringify(arrayPasos) : JSON.stringify(arrayPasosMensual);
    // PGESTION
    pasos = pasos.replace(/PGESTION/g, moment().format('YYYY'));
    // PLIMITE 0 80000 registros a la vez
    pasos = pasos.replace(/PLIMITE/g, '80000');
    // PPAGINA solo en una corrida
    pasos = pasos.replace(/PPAGINA/g, '1');
    // PMES
    pasos = pasos.replace(/PMES/g, moment().format('M'));
    // PFECHAINI
    pasos = pasos.replace(/PFECHAINI/g, fechaInicio);
    // PFECHAFIN
    pasos = pasos.replace(/PFECHAFIN/g, fechaFin);
    const item = {
      tipo_corte: tipo,
      gestion,
      mes,
      pasos,
      _usuario_creacion: idUsuario,
    };
    const ret = await ControlCorte.create(item);
    return ret;
  };

  const actualizarPasosControlCorte = async (id, controlCorteActualizado) => {
    const query = {
      where: {
        id_control_corte: id,
      }
    };
    return ControlCorte.update(controlCorteActualizado, query);
  };

  const consultaEstadoPaso = async (paso, tipo, gestion, mes) => {
    const query = `select fn_consulta_estado_paso('${paso}', '${tipo}', ${gestion}, ${mes}) as estado_paso`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  _app.dao.controlCorte = {
    listaControlCorte,
    realizarCorteAnual,
    realizarArmadoSigep,
    crearRegistroControlCorte,
    actualizarPasosControlCorte,
    detalleControlCorte,
    detalleControlCortePorId,
    consultaEstadoPaso,
  };
};
