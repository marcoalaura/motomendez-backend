module.exports = (app) => {
  const _app = app;
  const ParametroModel = app.src.db.models.parametro;

  /**
   * obtenerListadoGrupo - Método para obtener el listado de parametros por el grupo
   * @param {String} grupoParametro
   * @return {Promise}
   */
  const obtenerListadoGrupo = (grupoParametro) => {
    const query = {
      attributes: ['id_parametro', 'grupo', 'nombre', 'descripcion'],
      where: {
        grupo: grupoParametro,
        estado: 'ACTIVO',
      },
    };
    return ParametroModel.findAndCountAll(query);
  };

  _app.dao.parametro = {
    obtenerListadoGrupo,
  };
};
