import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;
  const TmpCorteAnual = app.src.db.models.tmp_corte_anual;

  /**
   * crearRegistro - Método para registrar datos del corte anual
   * @param {Object} registros
   * @return {Promise}
   */
  const crearRegistro = (registros) => {
    // return TmpCorteAnual.create(registros);
    return TmpCorteAnual.bulkCreate(registros);
  };

  const generarListaHabilitados = (usuario, gestion) => {
    const query = `select fn_filtrar_corte_anual( ${usuario}, ${gestion})`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const contrastarHabilitados = (usuario, gestion) => {
    const query = `select fn_contrastar_corte_anual( ${usuario}, ${gestion}) as contrastar`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const obtenerPendienteContrastacion = (gestion) => {
    const query = `select * from tmp_corte_anual where gestion = '${gestion}' and estado_contrastacion = 'PENDIENTE'`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * Devuelve numero de registros con estado diferente a PENDIENTE
   * @param {String} tipo 
   * @param {Int} gestion 
   */
  const buscarEstado = (tipo, gestion) => {
    const query = {
      where: {
        tipo,
        gestion,
        estado: { $ne: 'PENDIENTE' }
      }
    };
    return TmpCorteAnual.count(query);
  };

  const eliminarRegistros = (tipo, gestion) => {
    const query = {
      where: {
        tipo,
        gestion
      }
    };
    return TmpCorteAnual.destroy(query);
  };

  const importarRegistros = (idUsuario, gestion, tipo, estado) => {
    const query = `select fn_importar(${idUsuario}, ${gestion}, '${tipo}', '${estado}') as importar`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const estadoCorteAnual = (gestion) => {
    const query = `select count(*) cantidad, estado_contrastacion from tmp_corte_anual where estado = 'HABILITADO' and gestion = ${gestion} group by estado_contrastacion;`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const listarCorteAnual = () => {
    const query = 'select * from tmp_corte_anual';
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const listarCorteAnualHabilitados = (gestion) => {
    // Se pidio que se genere el reporte con el codigo de SIGEP
    // const query = `select * from tmp_corte_anual where gestion = '${gestion}' and estado = 'HABILITADO' and tipo = 'SIPRUN'`;
    const query = `select tmp_corte_anual.*, dpa.id_entidad from tmp_corte_anual left join dpa on dpa.cod_municipio = '0' || tmp_corte_anual.codigo_municipal where tmp_corte_anual.gestion = '${gestion}' and tmp_corte_anual.estado = 'HABILITADO' and tmp_corte_anual.tipo = 'SIPRUN'`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const listar = (consulta, paginar) => {
    const paginado = util.paginar(paginar);
    const query = {
      attributes: ['id', 'nro_documento', 'primer_apellido', 'segundo_apellido', 'apellido_casada', 'nombres',
        'fecha_nacimiento', 'nombre_municipio', 'estado_contrastacion', 'observacion_contrastacion', 'tipo', 'estado', 'observacion'],
      where: consulta,
      order: 'nro_documento ASC'
    };
    if (paginar.documento_identidad) {
      query.where.nro_documento = { $iLike: paginar.documento_identidad };
    }
    if (paginar.primer_apellido) {
      query.where.primer_apellido = { $iLike: paginar.primer_apellido };
    }
    if (paginar.segundo_apellido) {
      query.where.segundo_apellido = { $iLike: paginar.segundo_apellido };
    }
    if (paginar.nombres) {
      query.where.nombres = { $iLike: paginar.nombres };
    }
    Object.assign(query, paginado);
    return TmpCorteAnual.findAndCountAll(query);
  };

  const obtenerRegistro = (where) => {
    const query = {
      attributes: ['id', 'exp_departamento', 'nro_documento', 'complemento', 'exp_pais', 'primer_apellido', 'segundo_apellido', 'apellido_casada', 'nombres',
        'estado_civil', 'formato_inf', 'fecha_nacimiento', 'tipo_discapacidad', 'grados_disc', 'porcentaje', 'fecha_vigencia', 'pais', 'codigo_municipal', 'nombre_municipio',
        'direccion', 'telefono', 'celular', 'estado_contrastacion', 'observacion_contrastacion', 'gestion', 'tipo', 'estado', 'observacion'],
      where,
      order: 'nro_documento ASC'
    };
    return TmpCorteAnual.findOne(query);
  };

  const actualizar = (id, datos) => {
    const query = {
      where: { id },
    };
    return TmpCorteAnual.update(datos, query);
  };

  const cargarTmpCorteAnual = (idUsuario, gestion) => {
    const query = `select fn_cargar_tmp_corte_anual(${idUsuario}, ${gestion}) as cargar`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  _app.dao.tmp_corte_anual = {
    crearRegistro,
    estadoCorteAnual,
    listarCorteAnual,
    listarCorteAnualHabilitados,
    generarListaHabilitados,
    contrastarHabilitados,
    obtenerPendienteContrastacion,
    buscarEstado,
    eliminarRegistros,
    importarRegistros,
    listar,
    obtenerRegistro,
    actualizar,
    cargarTmpCorteAnual,
  };
};
