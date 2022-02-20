import util from './../../../lib/util';
const moment = require('moment');

module.exports = (app) => {
  const _app = app;

  const CorteMensualModel = app.src.db.models.corte_mensual;
  const CorteAnualModel = app.src.db.models.corte_anual;
  const DpaModel = app.src.db.models.dpa;
  const ReporteMensualModel = app.src.db.models.reporte_mensual;
  const MesModel = app.src.db.models.mes;
  const GestionModel = app.src.db.models.gestion;
  const ReporteRetroactivoModel = app.src.db.models.reporte_retroactivo;
  const ReporteAcumuladoModel = app.src.db.models.reporte_acumulado;

  const generarReporte = (codMunicipio, idGestion) => {
    const query = {
      attributes: ['nombre_completo', 'tipo_discapacidad'],
      where: {
        cod_municipio: codMunicipio,
        fid_mes: idGestion,
      },
    };
    return CorteMensualModel.find(query);
  };

  const obtenerMunicipio = (codMnicipio) => {
    const query = {
      attributes: ['municipio'],
      where: {
        cod_municipio: codMnicipio,
      },
    };
    return DpaModel.findOne(query);
  };

  const crearRegistro = (datos) => {
    return ReporteMensualModel.create(datos);
  };

  const crearRegistroRetroactivo = (datos) => {
    return ReporteRetroactivoModel.create(datos);
  };

  const crearRegistroAcumulado = (datos) => {
    return ReporteAcumuladoModel.create(datos);
  };

  /**
   * obtenerDatosMunicipio - Método para obtener los datos por municipio
   * @param {string} codMunicipio
   */
  const obtenerDatosMunicipio = (codMunicipio) => {
    const query = {
      attributes: ['departamento', 'provincia', 'municipio', 'cod_municipio'],
      where: {
        cod_municipio: codMunicipio,
      },
      raw: true,
    };
    return DpaModel.findOne(query);
  };

  /**
   * obtenerPcdsPorMunicipioCorteMensual - Método para obtener los pcds por municipio
   * @param {string} codMunicipio
   * @param {number} gestion
   * @param {number} idMes
   * @return {Promise}
   */
  const obtenerPcdsPorMunicipioCorteMensual = (codMunicipio, gestion, idMes) => {
    const query = `
      select max(c.fecha_vigencia), p.documento_identidad as c_i, p.formato_inf, p.nombres, p.primer_apellido, p.segundo_apellido, p.casada_apellido, p.estado_civil, p.complemento_documento, p.nombre_completo, p.telefono, pd.id_pcd
      from pcd as pd
      inner join persona as p on (pd.fid_persona = p.id_persona)
      inner join certificado as c on (pd.id_pcd = c.fid_pcd)
      inner join corte_mensual as cm on (pd.id_pcd = cm.fid_pcd)
      where pd.cod_municipio = '${codMunicipio}'
      and c.tipo_certificado = 'SIPRUNPCD'
      and cm.estado = 'REGISTRADO_SIGEP'
      and cm.fid_gestion = ${gestion}
      and cm.fid_mes = ${idMes}
      group by c.fid_pcd, p.documento_identidad, p.formato_inf, p.nombres, p.primer_apellido, p.segundo_apellido, p.casada_apellido, p.estado_civil, p.complemento_documento, p.nombre_completo, p.telefono, pd.id_pcd
      order by p.primer_apellido, p.segundo_apellido, p.nombres;
    `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * obtenerPcdsPorMunicipioCorteAnual - Método para obtener los pcds por municipio
   * @param {string} codMunicipio
   * @param {number} gestion
   * @return {Promise}
   */
  const obtenerPcdsPorMunicipioCorteAnual = (codMunicipio, gestion) => {
    const query = `
      select max(c.fecha_vigencia), p.documento_identidad as c_i, p.nombre_completo, p.telefono, pd.id_pcd
      from pcd as pd
      inner join persona as p on (pd.fid_persona = p.id_persona)
      inner join certificado as c on (pd.id_pcd = c.fid_pcd)
      inner join corte_anual as cm on (pd.id_pcd = cm.fid_pcd)
      where pd.cod_municipio = '${codMunicipio}'
      and c.tipo_certificado = 'SIPRUNPCD'
      and cm.fid_gestion = ${gestion}
      group by c.fid_pcd, p.documento_identidad, p.nombre_completo, p.telefono, pd.id_pcd;
    `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };
  /**
   * obtenerMunicipiosCorteMensual - Método para obtener municipios en el corte mensual
   * @param {number} gestion
   * @return {Promise}
   */
  const obtenerMunicipiosCorteMensual = (gestion, _estado) => {
    const query = {
      attributes: ['cod_municipio', app.src.db.sequelize.fn('count', app.src.db.sequelize.col('cod_municipio'))],
      where: {
        fid_gestion: gestion,
        estado: _estado
      },
      group: ['corte_mensual.cod_municipio'],
      raw: true,
    };
    return CorteMensualModel.findAll(query);
  };

  /**
   * obtenerMunicipiosCorteAnual - Método para obtener municipios en el corte anual
   * @param {number} gestion
   * @return {Promise}
   */
  const obtenerMunicipiosCorteAnual = (gestion) => {
    const query = {
      attributes: ['cod_municipio', app.src.db.sequelize.fn('count', app.src.db.sequelize.col('cod_municipio'))],
      where: {
        fid_gestion: gestion,
      },
      group: ['corte_anual.cod_municipio'],
      raw: true,
    };
    return CorteAnualModel.findAll(query);
  };

    /**
   * Por cada registro de persona mes y gestion comprueba si se le ha aplicado retroactivo
   * en el corte mensual del mes dado.
   * @param {string} ci,
   * @param {number} fid_mes: mes en numero entero,
   * @param {number} gestion
   * @param {array} tablaExcepciones: Array con excepciones de acuerdo a meses por ejemplo:
   * [
        { mes: 1, mesesCorte: [2], gestion: 2018 }, // para el corte de enero 2018
        { mes: 12, mesesCorte: [11, 12], gestion: 2018} // para el corte de diciembre
      ];
   * @return {boolean}: true o false segun sea retroactivo
   */
  const registroEsRetroactivo = async (ci, id_mes, gestion, tablaExcepciones) => {
    // EF - No controla bien lo del mes
    const query = `
      select cm."_fecha_creacion", cm."_fecha_modificacion", cm.fid_mes, p.documento_identidad, m.mes as mes
      from corte_mensual as cm, pcd as pcd , persona as p, mes m
      where p.id_persona = pcd.fid_persona and cm.fid_pcd = pcd.id_pcd
        and cm.fid_mes = m.id_mes
        and p.documento_identidad = '${ci}'
        and m.mes = ${id_mes}
        and cm.fid_gestion = ${gestion}
      `;
    let res;
    try {
      res = await app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
      // console.log('res ::::: ', res);
      if (res.length === 0) {
        // console.log(`---> No se ha encontrado registros para ci: ${ci}, mes: ${id_mes}, gestion: ${gestion}`);
        return false;
      }
      res = res[0];
    } catch (e) {
      // console.log('\niiiiii Error consultando registros:', e, '\n');
      return false;
    }
    // una tabla de excepciones para controlar las fechas de cortes
    if (!tablaExcepciones) {
      tablaExcepciones = [
        { mes: 1, mesesCorte: [2], gestion: 2018 },    // para el corte de enero 2018
      ];
    }
    let fechaCreacion = moment(res._fecha_creacion);
    let mesCreacion = fechaCreacion.month() + 1;
    /* console.log('fecha creacion:', fechaCreacion,
                'mesCreacion:', mesCreacion,
                'mesConsulta:', id_mes,
                'gestion', gestion, typeof gestion);  */
    // filtrando por casos excepcionales
    for (let i = 0; i < tablaExcepciones.length; i++) {
      let obj = tablaExcepciones[i];
      // mes y gestion donde se aplica el caso excepcional
      if (parseInt(obj.mes) === parseInt(id_mes) && parseInt(obj.gestion) === parseInt(gestion)) {
        for (let j = 0; j < obj.mesesCorte.length; j++) {
          // console.log('Probando caso excepcional:::', obj.mesesCorte[j], 'en mes', mesCreacion);
          // se aplica el caso excepcional
          if (obj.mesesCorte[j] === mesCreacion) {
            // console.log('**** caso excepcional, no es retroactivo');
            return false; // no es retroactivo
          }
        }
      }
    }
    // cuando se ha aplicado el corte en un mes diferente al habitual
    // if (fid_mes === 12 && gestion === 2018) {
    //   return true;
    // }
    if (parseInt(mesCreacion) !== parseInt(id_mes)) {
      // console.log('Retroactivo encontrado ************');
      return true;
    }
    return false;
  };

  const listaReporteMensual = (idGestion, consulta, paginar) => {
    const paginado = util.paginar(paginar);
    const query = {
      attributes: ['id_reporte_mensual', 'estado'],
      where: consulta,
      include: [
        {
          model: MesModel,
          attributes: ['fid_gestion', 'mes'],
          as: 'municipio_mes',
          where: {
            fid_gestion: idGestion,
          },
          requerid: true,
        },
        {
          model: DpaModel,
          attributes: ['cod_municipio', 'municipio', 'provincia', 'departamento'],
          as: 'dpa',
          requerid: true,
        },
      ],
      order: '"dpa.departamento" ASC, "dpa.provincia" ASC, "dpa.municipio" ASC',
    };
    Object.assign(query, paginado);
    return ReporteMensualModel.findAndCountAll(query);
  };

  const listaReporteMensualRegularizado = (idGestion, consulta, paginar) => {
    const paginado = util.paginar(paginar);
    const query = {
      attributes: ['id_reporte_retroactivo', 'estado', 'mes'],
      where: consulta,
      include: [
        {
          model: DpaModel,
          attributes: ['cod_municipio', 'municipio', 'provincia', 'departamento'],
          as: 'dpa',
          requerid: true,
        },
      ],
      order: '"dpa.departamento" ASC, "dpa.provincia" ASC, "dpa.municipio" ASC',
    };
    Object.assign(query, paginado);
    return ReporteRetroactivoModel.findAndCountAll(query);
  };

  const listaReporteMensualAcumulado = (idGestion, consulta, paginar) => {
    const paginado = util.paginar(paginar);
    const consulta2 = consulta.cod_municipio ? { mes: consulta.mes, fid_gestion: idGestion, cod_municipio: consulta.cod_municipio } : { mes: consulta.mes, fid_gestion: idGestion };
    const query = {
      attributes: ['id_reporte_acumulado', 'estado', 'mes'],
      where: consulta2,
      include: [
        {
          model: DpaModel,
          attributes: ['cod_municipio', 'municipio', 'provincia', 'departamento'],
          as: 'dpa',
          requerid: true,
        },
      ],
      order: '"dpa.departamento" ASC, "dpa.provincia" ASC, "dpa.municipio" ASC',
    };
    Object.assign(query, paginado);
    return ReporteAcumuladoModel.findAndCountAll(query);
  };


  const obtenerReporteMensual = (idReporteMensual) => {
    return ReporteMensualModel.findById(idReporteMensual);
  };

  const obtenerReporteMensualRegularizado = (idReporteMensual) => {
    return ReporteRetroactivoModel.findById(idReporteMensual);
  };

  const obtenerReporteMensualAcumulado = (id) => {
    return ReporteAcumuladoModel.findById(id);
  };

  const obtenerReporteAnual = (gestion) => {
    return GestionModel.findById(gestion);
  };

  /**
   * obtenerMunicipiosRegularizados - Método para obtener municipios en el corte mensual
   * @param {date} fechaInicio
   * @param {date} fechaFin
   * @return {Promise}
   */
  const obtenerMunicipiosRegularizados = (fechaInicio, fechaFin, estado) => {
    const query = `
    select cm.cod_municipio, count (cod_municipio)
    from corte_mensual as cm
    where date_trunc('day', cm._fecha_modificacion) BETWEEN '${fechaInicio}' and '${fechaFin}'
    and cm.estado = '${estado}'
    group by (cm.cod_municipio)
    `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * obtenerPcdsPorMunicipioRegularizadosMensual - Método para obtener los pcds regularizados por municipio agrupados mensualmente
   * @param {string} codMunicipio
   * @param {date} fechaInicio
   * @param {date} fechaFin
   * @param {number} gestion NO es usado
   * @param {number} idMes NO es usado
   * @return {Promise}
   */
  const obtenerPcdsPorMunicipioCortesMensualesRegularizados = (codMunicipio, fechaInicio, fechaFin) => {
    const query = `
      select cm.fid_mes, p.documento_identidad as c_i, p.formato_inf, p.nombres, p.primer_apellido, p.segundo_apellido, p.casada_apellido, p.estado_civil, p.complemento_documento, p.nombre_completo, p.telefono, pd.id_pcd, cm.fid_gestion
      from pcd as pd
      inner join persona as p on (pd.fid_persona = p.id_persona)
      inner join corte_mensual as cm on (pd.id_pcd = cm.fid_pcd)
      where pd.cod_municipio = '${codMunicipio}'
      and cm.estado = 'REGISTRADO_SIGEP'
      and date_trunc('day',cm._fecha_modificacion) BETWEEN '${fechaInicio}' and '${fechaFin}'
      order by cm.fid_mes, p.primer_apellido, p.segundo_apellido, p.nombres;                   
    `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * obtenerPcdsPorMunicipioCortesMensualesAcumulado - Método para obtener los pcds acumulados por municipio
   * @param {string} codMunicipio
   * @param {number} gestion
   * @param {number} idUsuario
   * @return {Promise}
   */
  const obtenerPcdsPorMunicipioCortesMensualesAcumulado = (codMunicipio, gestion, idUsuario) => {
    const query = `select * from fn_reporte(${idUsuario}, ${gestion}, '${codMunicipio}');`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  _app.dao.reporte = {
    generarReporte,
    obtenerMunicipio,
    crearRegistro,
    obtenerMunicipiosCorteMensual,
    obtenerMunicipiosCorteAnual,
    obtenerDatosMunicipio,
    obtenerPcdsPorMunicipioCorteMensual,
    obtenerPcdsPorMunicipioCorteAnual,
    listaReporteMensual,
    registroEsRetroactivo,
    obtenerReporteMensual,
    obtenerReporteAnual,
    obtenerMunicipiosRegularizados,
    obtenerPcdsPorMunicipioCortesMensualesRegularizados,
    crearRegistroRetroactivo,
    obtenerReporteMensualRegularizado,
    listaReporteMensualRegularizado,
    obtenerPcdsPorMunicipioCortesMensualesAcumulado,
    crearRegistroAcumulado,
    listaReporteMensualAcumulado,
    obtenerReporteMensualAcumulado,
  };
};
