import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;
  const TmpPcd = app.src.db.models.tmp_pcd;
  const TmpPcdLog = app.src.db.models.tmp_pcd_log;

  const crearRegistro = (registros) => {
    return TmpPcd.create(registros);
  };

  const contrastarHabilitados = (usuario) => {
    const query = `select fn_contrastar_tmp_pcd( ${usuario} ) as contrastar`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const cargarTmpPcd = (usuario) => {
    const query = `select fn_cargar_tmp_pcd( ${usuario} ) as carga`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const registrarTmpPcd = (usuario) => {
    const query = `select fn_registro_pcd_corte_mensual( ${usuario} ) as registro`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const obtenerPendienteContrastacion = () => {
    const query = {
      attributes: ['id', 'documento_identidad', 'complemento_documento', 'expedido', 'tipo_documento', 'fecha_nacimiento', 'nombres', 'primer_apellido', 'segundo_apellido', 'casada_apellido', 'formato_inf', 'sexo', 'estado_civil', 'direccion', 'telefono', 'codigo_municipio', 'numero_registro', 'fecha_emision', 'fecha_vigencia', 'tipo_discapacidad', 'grado_discapacidad', 'porcentaje_discapacidad', 'tipo', 'observacion_contrastacion', 'estado_contrastacion', 'fecha_registro', 'mes_carga', 'gestion_carga', 'estado', 'observacion_estado', 'estado_corte_anual'],
      where: {
        estado_contrastacion: 'PENDIENTE',
      },
    };
    return TmpPcd.findAndCountAll(query);
  };

  const buscarEstado = (tipo, gestion) => {
    const query = {
      where: {
        tipo,
        gestion,
        estado: { $ne: 'PENDIENTE' },
      },
    };
    return TmpPcd.count(query);
  };

  const eliminarRegistros = (tipo, gestion) => {
    const query = {
      where: {
        tipo,
        gestion,
      },
    };
    return TmpPcd.destroy(query);
  };

  const listar = (consulta, paginar) => {
    const paginado = util.paginar(paginar);
    const query = {
      attributes: ['id', 'documento_identidad', 'primer_apellido', 'segundo_apellido', 'nombres', 'fecha_nacimiento', 'codigo_municipio',
        'estado_contrastacion', 'observacion_contrastacion', 'tipo', 'observacion_estado', 'complemento_documento', 'expedido', 'casada_apellido',
        'formato_inf', 'estado_civil', 'direccion', 'fecha_vigencia', 'tipo_discapacidad', 'grado_discapacidad', 'porcentaje_discapacidad'],
      where: consulta,
      order: 'documento_identidad ASC'
    };
    if (paginar.documento_identidad) {
      query.where.documento_identidad = { $iLike: paginar.documento_identidad };
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
    return TmpPcd.findAndCountAll(query);
  };

  const obtenerRegistro = (where) => {
    const query = {
      attributes: ['id', 'documento_identidad', 'complemento_documento', 'expedido', 'primer_apellido', 'segundo_apellido', 'casada_apellido', 'nombres',
        'estado_civil', 'formato_inf', 'fecha_nacimiento', 'telefono', 'fecha_registro', 'estado_contrastacion', 'direccion'],
      where
    };
    return TmpPcd.findOne(query);
  };
  const obtenerRegistroCompleto = (where) => {
    const query = {
      attributes: ['id', 'documento_identidad', 'complemento_documento', 'expedido', 'tipo_documento', 'fecha_nacimiento', 'nombres', 'primer_apellido',
        'segundo_apellido', 'casada_apellido', 'formato_inf', 'sexo', 'estado_civil', 'direccion', 'telefono', 'codigo_municipio', 'numero_registro',
        'fecha_emision', 'fecha_vigencia', 'tipo_discapacidad', 'grado_discapacidad', 'porcentaje_discapacidad', 'tipo', 'observacion_contrastacion',
        'estado_contrastacion', 'fecha_registro', 'mes_carga', 'gestion_carga', 'estado', 'observacion_estado', 'estado_corte_anual'],
      where
    };
    return TmpPcd.findOne(query);
  };

  const actualizar = (id, datos) => {
    const query = {
      where: { id },
    };
    return TmpPcd.update(datos, query);
  };

  const crearTmpPcdLog = (datos) => {
    return TmpPcdLog.create(datos);
  };

  const consultaRegistroTmpPcdLog = (id, mesCarga, gestionCarga) => {
    const query = `SELECT count(*) as cantidad FROM json_array_elements((SELECT array_to_json(array_agg(c.datos)) FROM tmp_pcd_log c)) WHERE (value::JSON->'id')::VARCHAR = '${id}' and (value::JSON->'mes_carga')::VARCHAR = '${mesCarga}' and (value::JSON->'gestion_carga')::VARCHAR = '${gestionCarga}';`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  _app.dao.tmp_pcd = {
    crearRegistro,
    contrastarHabilitados,
    cargarTmpPcd,
    registrarTmpPcd,
    obtenerPendienteContrastacion,
    buscarEstado,
    eliminarRegistros,
    listar,
    obtenerRegistro,
    obtenerRegistroCompleto,
    actualizar,
    crearTmpPcdLog,
    consultaRegistroTmpPcdLog,
  };
};
