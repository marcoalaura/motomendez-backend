import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;
  const GestionModel = app.src.db.models.gestion;
  const MesModel = app.src.db.models.mes;
  const DetalleModel = app.src.db.models.detalle;
  const ReporteRetroactivoModel = app.src.db.models.reporte_retroactivo;
  const ReporteAcumuladoModel = app.src.db.models.reporte_acumulado;

  /**
   * listarGestion - Método que retorna la lista de gestiones
   * @return {Promise}
   */
  const listarGestion = () => {
    return GestionModel.findAll({
      attributes: ['id_gestion', '_fecha_creacion', 'estado'],
      order: 'id_gestion ASC',
      include: [
        {
          model: MesModel,
          as: 'mes',
          attributes: ['fid_gestion', 'mes', 'estado', 'fecha_envio', '_fecha_creacion'],
        },
      ],
    });
  };

  const listarAnio = () => {
    return GestionModel.findAll({
      attributes: ['id_gestion'],
    });
  };

  const listarMes = (gestion) => {
    return MesModel.findAll({
      attributes: ['id_mes', 'mes', 'estado', 'fid_gestion'],
      where: {
        fid_gestion: gestion,
      },
    });
  };

  const listarMesRegularizado = (gestion) => {
    return ReporteRetroactivoModel.findAll({
      attributes: ['mes', 'fid_gestion'],
      where: {
        fid_gestion: gestion,
      },
      group: ['mes', 'fid_gestion'],
    });
  };

  const listarMesAcumulado = (gestion) => {
    return ReporteAcumuladoModel.findAll({
      attributes: ['mes', 'fid_gestion'],
      where: {
        fid_gestion: gestion,
      },
      group: ['mes', 'fid_gestion'],
      order: 'mes'
    });
  };

  const obtenerMes = (idMes) => {
    return MesModel.findOne({
      attributes: ['id_mes', 'mes', 'estado'],
      where: {
        id_mes: idMes,
      },
    });
  };

  const obtenerMesByGestionMes = (gestion, mes) => {
    return MesModel.findOne({
      attributes: ['id_mes', 'mes', 'estado'],
      where: {
        fid_gestion: gestion,
        mes
      }
    });
  };

  const obtenerDetalleGestion = (idGestion, parametros) => {
    const paginado = util.paginar(parametros);
    const query = {
      attributes: ['id_detalle', 'estado', 'nombre_completo', 'tipo_discapacidad', 'grado_discapacidad', 'porcentaje_discapacidad', 'fecha_vigencia', 'cod_municipio', 'departamento', 'provincia', 'municipio'],
      where: {
        fid_gestion: idGestion,
        cod_municipio: parametros.cod_municipio,
      },
    };
    Object.assign(query, paginado);
    return DetalleModel.findAndCountAll(query);
  };
  /**
   * crearGestion - Método para crear una persona
   * @param {Object} datosGestion
   * @return {Promise}
   */
  const crearGestion = (datosGestion) => {
    return GestionModel.create(datosGestion);
  };

  /**
   * crearDetalles - Método para crear detalle en lote
   * @params {array} datosDetalle
   * @return {Promise}
   */
  const crearDetalles = (datosDetalle) => {
    return DetalleModel.bulkCreate(datosDetalle, { returning: true });
  };

  const actualizarGestion = (gestion, datos) => {
    const query = {
      where: {
        id_gestion: gestion,
      },
    };
    return GestionModel.update(datos, query);
  };

  const obtenerReporteVigente = (gestion) => {
    const query = `select * from mes where id_mes = (select max(rp.fid_mes) from reporte_mensual rp inner join mes m on (rp.fid_mes = m.id_mes and m.fid_gestion = ${gestion}));`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const obtenerAcumuladoVigente = (gestion) => {
    const query = `select * from mes where fid_gestion = ${gestion} and mes = (select max(mes) from reporte_acumulado where fid_gestion = ${gestion});`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  _app.dao.gestion = {
    listarGestion,
    listarAnio,
    listarMes,
    crearGestion,
    crearDetalles,
    obtenerDetalleGestion,
    actualizarGestion,
    obtenerMes,
    listarMesRegularizado,
    obtenerReporteVigente,
    obtenerAcumuladoVigente,
    listarMesAcumulado,
    obtenerMesByGestionMes,
  };
};
