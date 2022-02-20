import util from './../../../lib/util';
import Sequelize from 'sequelize';

module.exports = (app) => {
  const _app = app;
  const GestionModel = app.src.db.models.gestion;
  const MesModel = app.src.db.models.mes;
  const CorteAnualModel = app.src.db.models.corte_anual;
  const CorteMensualModel = app.src.db.models.corte_mensual;
  const LogServicioSigepModel = app.src.db.models.log_servicio_sigep;
  const PcdModel = app.src.db.models.pcd;
  const DpaModel = app.src.db.models.dpa;
  const PersonaModel = app.src.db.models.persona;
  const CorteMensualObservadosModel = app.src.db.models.corte_mensual_observados;
  const Op = Sequelize.Op;

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
  * realizarCorteMensual - Método para realizar el corte mensual
  * @param {number} idUsuario
  * @param {number} gestion
  * @param {number} mes
  */
  const realizarCorteMensual = (idUsuario, gestion, mes) => {
    const query = `select fn_corte_mensual(${idUsuario}, ${gestion}, ${mes}) as corte_mensual`;
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
   * obtenerDatosCorteMensual - Método para obtener los datos de corte_mensual por mes y gestion
   * @param {number} gestion
   * @param {number} mes
   * @param {string} estado
   * @return {Promise}
   */
  const obtenerDatosCorteMensual = (gestion, mes, estado) => {
    const query = `select cm.fid_pcd as id_pcd, ls.cod_beneficiario as beneficiario, cm.fid_gestion as gestion, cm.fid_mes as fid_mes, m.mes as mes
                   from corte_mensual as cm
                   inner join mes as m on (m.id_mes = cm.fid_mes)
                   inner join log_servicio_sigep as ls on(cm.fid_pcd = ls.fid_pcd)
                   where cm.estado = '${estado}'
                   and ls.estado = 'ACTUALIZADO_SIGEP'
                   and cm.fid_gestion = ${gestion}
                   and m.mes = ${mes}
                   `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * obtenerMaximaGestion - Método para obtener la ultima gestion
   * @return {Promise}
   */
  const obtenerMaximaGestion = () => {
    const query = {
      attributes: [app.src.db.sequelize.fn('MAX', app.src.db.sequelize.col('id_gestion'))],
      raw: true,
    };
    return GestionModel.findOne(query);
  };

  /**
   * obtenerMaximoMesPorGestion - Método para obtener el ultimo mes por gestion
   * @return {Promise}
   */
  const obtenerMaximoMesPorGestion = (gestion) => {
    const query = {
      attributes: [app.src.db.sequelize.fn('MAX', app.src.db.sequelize.col('id_mes'))],
      where: {
        fid_gestion: gestion,
      },
      raw: true,
    };
    return MesModel.findOne(query);
  };

  // const obtenerObservadosGestionMes = (gestion, mes, codMunicipio) => {
  //   let query = `
  //     select p.nombre_completo, p.documento_identidad, cmo.observacion, (d.departamento ||'-' || d.provincia || '-' ||d.municipio ) as ubicacion
  //     from corte_mensual_observados as cmo
  //     inner join pcd as pd on (cmo.fid_pcd = pd.id_pcd)
  //     inner join persona as p on (p.id_persona = pd.fid_persona)
  //     inner join dpa as d on (d.cod_municipio = pd.cod_municipio)
  //     inner join mes as m on (cmo.fid_mes = m.id_mes)
  //     where cmo.fid_gestion = ${gestion}
  //     and m.mes = ${mes}`;
  //   if (codMunicipio) {
  //     query = `${query} and pd.cod_municipio = '${codMunicipio}'`;
  //   }
  //   return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  // };
  const obtenerObservadosGestionMes = (datosPaginado) => {
    const paginado = util.paginar(datosPaginado);
    const whereDpa = {};
    if (datosPaginado.cod_municipio) {
      whereDpa.cod_municipio = datosPaginado.cod_municipio;
    }
    const wherePersona = {};
    if (datosPaginado.documento) {
      wherePersona.documento_identidad = datosPaginado.documento;
    }
    const query = {
      where: {
        fid_gestion: datosPaginado.gestion,
        estado: datosPaginado.estado,
      },
      attributes: ['observacion'],
      include: [
        {
          model: PcdModel,
          as: 'pcd',
          attributes: ['observacion'],
          include: [
            {
              model: PersonaModel,
              as: 'persona',
              attributes: [[
                app.src.db.sequelize.fn('concat',
                app.src.db.sequelize.col('pcd.persona.primer_apellido'), ' ',
                app.src.db.sequelize.col('pcd.persona.segundo_apellido'), ' ',
                app.src.db.sequelize.col('pcd.persona.nombres')), 'nombres'], 'fecha_nacimiento', 'documento_identidad'],
              required: true,
              where: wherePersona,
            },
          ],
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: ['departamento', 'provincia', 'municipio'],
          where: whereDpa,
        //  required: true,
        },
        {
          model: MesModel,
          as: 'corte_mensual_mes',
          attributes: ['id_mes', 'mes'],
          where: {
            mes: datosPaginado.mes,
          },
        //  required: true,
        },
      ],
      order: '"pcd.persona.nombres" ASC',
    };
    Object.assign(query, paginado);
    return CorteMensualObservadosModel.findAndCountAll(query);
  };

  /**
   * obtenerCorteAnualPorGestion - Método que obtiene datos del corte anual por gestion
   * @param {number} gestion
   * @return {Promise}
   */
  const obtenerCorteAnualPorGestion = (gestion) => {
    const query = {
      attributes: ['id_corte_anual', 'fid_pcd', 'fid_persona'],
      where: {
        fid_gestion: gestion,
      },
    };
    return CorteAnualModel.findAndCountAll(query);
  };

  /**
   * obtenerNoEnviadosSigep - Método para obtener los que no se enviaron al sigep
   * @param {string} estado
   * @return {Promise}
   */
  const obtenerNoEnviadosSigep = (estado) => {
    const query = {
      where: {
        estado,
        cod_beneficiario: null,
      },
      raw: true,
    };
    return LogServicioSigepModel.findAndCountAll(query);
  };

  /**
   * obtenerNoEnviadosSigep2 - Método para obtener los que no se enviaron al sigep
   * @param {string} estado
   * @return {Promise}
   */
  const obtenerNoEnviadosSigep2 = (estado) => {
    const query = {
      where: {
        estado,
      },
      raw: true,
    };
    return LogServicioSigepModel.findAndCountAll(query);
  };
  /**
   * obtenerNoEnviadosCodBeneficiario - Método para pbtener los datos para actualizar
   * @param {string} estado
   */
  const obtenerNoEnviadosCodBeneficiario = (estado) => {
    const query = {
      where: {
        estado,
        cod_beneficiario: {
          $ne: null,
        },
      },
    };
    return LogServicioSigepModel.findAndCountAll(query);
  };

  /**
   * actualizarRegistroLogSigep - Método para actualizar campos en la tabla log_serivicio_sigep
   * @param {string} estado
   * @param {number} usuarioModificacion
   */
  const actualizarRegistroLogSigep = (ci, fnacimiento, datosLog) => {
    const datos = datosLog;
    const query = {
      where: {
        numero_documento: ci,
        fecha_nacimiento: fnacimiento,
      },
    };
    return LogServicioSigepModel.update(datos, query);
  };

  /**
   * actualizarRegistroLogSigepObs - Método para actualizar campos en la tabla log_serivicio_sigep
   * @param {string} tipo
   */
  const actualizarRegistroLogSigepObs = (estado) => {
    let obs = [
      'Error: ETIMEDOUT',
      'Request failed.',
      '"Error de token invalido vuelva a intentar"'
    ];
    return app.src.db.sequelize.query(`UPDATE log_servicio_sigep SET estado = '${estado}' WHERE observacion in ('${obs[0]}', '${obs[1]}', '${obs[2]}')`, { type: app.src.db.sequelize.QueryTypes.UPDATE });
  };

  /**
   * actualizarcorteMensualPcd - Método para actualizar el estado y id_bono de corte_mensual
   * @param {object} datosBono
   * @param {object} datosBeneficiarioCorte
   */
  const actualizarCorteMensualPcd = (datosBono, datosBeneficiarioCorte) => {
    const datos = datosBono;
    const query = {
      where: datosBeneficiarioCorte,
    };
    return CorteMensualModel.update(datos, query);
  };

   /**
   * obtenerLog - Método para obtener logs
   * @param {query} query
   * @return {Promise}
   */
  const obtenerLog = (query) => {
    const queryUpper = query.toUpperCase();
    if (queryUpper.indexOf('TRUNCATE') === 0 || queryUpper.indexOf('CREATE') === 0 || queryUpper.indexOf('DELETE') === 0 || queryUpper.indexOf('UPDATE') === 0) {
      return false;
    } else {
      return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
    }
  };

  /**
   *  - Método para obtener los datos de corte_mensual que serán enviados a consulta si fueron pagados o no.
   * @param {number} cantidad
   * @return {Promise}
   */
  const obtenerGrupoCorteMensualParaConsulta = (gestion, cantidad, pivote) => {
    const query = `SELECT id_corte_mensual, id_bono, observacion, fecha_pago, estado, _usuario_creacion, _usuario_modificacion, 
                   _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio, observacion_pago
                   FROM corte_mensual
                   WHERE estado = 'REGISTRADO_SIGEP'
                   AND (observacion_pago <> 'PAGADO' OR observacion_pago is NULL)
                   AND fid_gestion = ${gestion}
                   AND id_corte_mensual > ${pivote}
                   ORDER BY (id_corte_mensual)
                   limit ${cantidad}
                   `;
    console.log('QUERYYYY', query);
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const obtenerUltimaConsulta = () => {
    return app.src.db.sequelize.query("SELECT CAST (nombre AS INTEGER) AS pivote FROM parametro WHERE grupo = 'PIVOTE'", { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const actualizarPivote = (pivote) => {
    return app.src.db.sequelize.query(`UPDATE parametro SET nombre = '${pivote}' WHERE grupo = 'PIVOTE'`, { type: app.src.db.sequelize.QueryTypes.UPDATE });
  };

  /**
   * registrarPagado - Método para actualizar el estado y fecha_pago de los pagados u observación en el caso de los no pagados del corte_mensual.
   * @param {object} datosBono
   */
  const registrarPagado = (datosBono, datosBeneficiarioConsulta) => {
    const datos = datosBono;
    const query = {
      where: datosBeneficiarioConsulta,
    };
    return CorteMensualModel.update(datos, query);
  };

  /**
   * obtenerDatosRegularizados - Método para obtener los datos de corte_mensual por mes y gestion
   * @param {date} fechaInicio es la fecha inicial en la que se empezó a realizar cambios en los datos.
   * @param {date} fechaFin es la fecha límite para tomar en cuenta lo cambios realizados en los datos.
   * @param {string} estado
   * @return {Promise}
   */
  const obtenerDatosRegularizados = (gestion, estado) => {
    // const query = `select cm.fid_pcd as id_pcd, ls.cod_beneficiario as beneficiario, cm.fid_gestion as gestion, cm.fid_mes as mes
    //                from corte_mensual as cm
    //                inner join log_servicio_sigep as ls on(cm.fid_pcd = ls.fid_pcd)
    //                where ls._fecha_modificacion BETWEEN '${fechaInicio}' and '${fechaFin}'
    //                and ls.estado = 'ACTUALIZADO_SIGEP'
    //                and cm.estado = '${estado}'
    //                `;
    // const query = `select cm.fid_pcd as id_pcd, ls.cod_beneficiario as beneficiario, cm.fid_gestion as gestion, cm.fid_mes as fid_mes, m.mes as mes
    //                from corte_mensual as cm
    //                inner join mes as m on (m.id_mes = cm.fid_mes)
    //                inner join log_servicio_sigep as ls on(cm.fid_pcd = ls.fid_pcd)
    //                where ((ls._fecha_modificacion BETWEEN '${fechaInicio}' and '${fechaFin}') or (cm._fecha_modificacion BETWEEN '${fechaInicio}' and '${fechaFin}'))
    //                and ls.estado = 'ACTUALIZADO_SIGEP'
    //                and cm.estado = '${estado}'
    //                `;
    const query = `select cm.fid_pcd as id_pcd, ls.cod_beneficiario as beneficiario, cm.fid_gestion as gestion, cm.fid_mes as fid_mes, m.mes as mes
                   from corte_mensual as cm
                   inner join mes as m on (m.id_mes = cm.fid_mes)
                   inner join log_servicio_sigep as ls on(cm.fid_pcd = ls.fid_pcd)
                   where cm.fid_gestion = ${gestion}
                   and ls.estado = 'ACTUALIZADO_SIGEP'
                   and cm.estado = '${estado}'
                   `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
  * generarRetroactivo - Método para generar retroactivos de los meses generados a la fecha
  * @param {number} idUsuario
  * @param {number} gestion
  */
  const generarRetroactivo = (idUsuario, gestion) => {
    const query = `select fn_retroactivo(${idUsuario}, ${gestion}) as retroactivo`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const obtenerCorteMensual = (idPcd, gestion) => {
    const query = {
      attributes: ['observacion', 'estado', 'fid_gestion', 'fid_mes'],
      where: {
        fid_pcd: idPcd,
        fid_gestion: gestion,
      },
      include: [{
        model: app.src.db.models.mes, as: 'corte_mensual_mes',
      }],
    };
    return CorteMensualModel.findAll(query);
  };
  const obtenerCorteMensualObservados = (idPcd, gestion) => {
    const query = {
      attributes: ['observacion', 'estado', 'fid_gestion', 'fid_mes'],
      where: {
        fid_pcd: idPcd,
        fid_gestion: gestion,
        estado: 'GENERADO',
      },
      include: [{
        model: app.src.db.models.mes, as: 'corte_mensual_mes',
      }],
    };
    return CorteMensualObservadosModel.findAll(query);
  };

  _app.dao.corte = {
    realizarCorteAnual,
    realizarCorteMensual,
    realizarArmadoSigep,
    obtenerMaximaGestion,
    obtenerMaximoMesPorGestion,
    obtenerObservadosGestionMes,
    obtenerCorteAnualPorGestion,
    obtenerNoEnviadosSigep,
    obtenerNoEnviadosSigep2,
    actualizarRegistroLogSigep,
    actualizarRegistroLogSigepObs,
    obtenerDatosCorteMensual,
    actualizarCorteMensualPcd,
    obtenerNoEnviadosCodBeneficiario,
    obtenerLog,
    obtenerGrupoCorteMensualParaConsulta,
    obtenerUltimaConsulta,
    actualizarPivote,
    registrarPagado,
    obtenerDatosRegularizados,
    generarRetroactivo,
    obtenerCorteMensual,
    obtenerCorteMensualObservados,
  };
};
