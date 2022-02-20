import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;

  /**
   * obtenerListas - Método para obtener listas temporales de pcd
   */
  // const obtenerListas = (fechaInicio, fechaFin) => {
  //   const query = `select * from tmp_siprunpcd
  //                  where observacion_contrastacion like 'DATOS CORRECTOS'
  //                  and to_date(fecha_vigencia, 'DD/MM/YYYY') >= to_date('${fechaInicio}', 'DD/MM/YYYY')
  //                  and to_date(fecha_vigencia, 'DD/MM/YYYY') <= to_date('${fechaFin}', 'DD/MM/YYYY')`;
  //   return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  // };
  const obtenerListas = (gestion, limite, pagina) => {
    const query = `select * from tmp_siprunpcd 
                   where gestion = ${gestion} and observacion_contrastacion = 'DATOS CORRECTOS' 
                   order by nro asc limit ${limite} offset ${limite}*${pagina - 1};`;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const consulta = (query) => {
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * buscar - Método para buscar de la temporal
   * @return {Promise}
   */
  const buscar = async (datosPaginado) => {
    const paginado = util.paginar(datosPaginado);
    let query = `select t.nro_documento, t.primer_apellido, t.segundo_apellido, t.nombres, t.apellido_casada, t.fecha_nacimiento,
    t.codigo_municipal, t.nombre_municipio, t.observacion_contrastacion, l.estado, l.observacion
    from tmp_siprunpcd as t
    left join log_servicio_sigep as l on (t.nro_documento = l.documento_identidad)
    where 1=1 `;
    if (datosPaginado.documento_identidad) {
      query = `${query} and t.nro_documento like '${datosPaginado.documento_identidad}%'`;
    }
    if (datosPaginado.primer_apellido) {
      query = `${query} and upper(t.primer_apellido) like '${datosPaginado.primer_apellido.toUpperCase()}%'`;
    }
    if (datosPaginado.segundo_apellido) {
      query = `${query} and upper(t.segundo_apellido) like '${datosPaginado.segundo_apellido.toUpperCase()}%'`;
    }
    if (datosPaginado.nombres) {
      query = `${query} and upper(t.nombres) like '%${datosPaginado.nombres.toUpperCase()}%'`;
    }
    if (datosPaginado.gestion) {
      query = `${query} and t.gestion = ${datosPaginado.gestion}`;
    }
    const count = await consulta(query);
    const queryLimit = ` ${query} limit ${paginado.limit} offset ${paginado.offset}`;
    const rows = await consulta(queryLimit);
    const datos = {
      count: count.length,
      rows,
    };
    return datos;
  };

  const buscarPersonaPorNombre = async (fecha_nacimiento, nombres, primer_apellido, segundo_apellido) => {
    let query = '';
    if (!primer_apellido) {
      query = `select t.nro_documento, t.primer_apellido, t.segundo_apellido, t.nombres, t.apellido_casada, t.fecha_nacimiento,
      t.codigo_municipal, t.nombre_municipio, t.observacion_contrastacion, dpa.departamento, dpa.provincia, dpa.municipio
      from tmp_siprunpcd as t
      inner join dpa on dpa.cod_municipio = ('0' || t.codigo_municipal)
      where (nro_documento = 'NULL' AND nombres = '${nombres}' AND (primer_apellido is null) and (segundo_apellido = '${segundo_apellido}'))
      ORDER BY 1 LIMIT 1;`
    } else if (!segundo_apellido) {
      query = `select t.nro_documento, t.primer_apellido, t.segundo_apellido, t.nombres, t.apellido_casada, t.fecha_nacimiento,
      t.codigo_municipal, t.nombre_municipio, t.observacion_contrastacion, dpa.departamento, dpa.provincia, dpa.municipio
      from tmp_siprunpcd as t
      inner join dpa on dpa.cod_municipio = ('0' || t.codigo_municipal)
      where (nro_documento = 'NULL' AND nombres = '${nombres}' AND (primer_apellido = '${primer_apellido}') and (segundo_apellido is NULL))
      ORDER BY 1 LIMIT 1;`
    } else {
      query = `select t.nro_documento, t.primer_apellido, t.segundo_apellido, t.nombres, t.apellido_casada, t.fecha_nacimiento,
      t.codigo_municipal, t.nombre_municipio, t.observacion_contrastacion, dpa.departamento, dpa.provincia, dpa.municipio
      from tmp_siprunpcd as t
      inner join dpa on dpa.cod_municipio = ('0' || t.codigo_municipal)
      where (nro_documento = 'NULL' AND nombres = '${nombres}' AND (primer_apellido = '${primer_apellido}') and (segundo_apellido = '${segundo_apellido}'))
      ORDER BY 1 LIMIT 1;`
    }
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };


  _app.dao.tmp_siprunpcd = {
    obtenerListas,
    buscar,
    buscarPersonaPorNombre,
  };
};
