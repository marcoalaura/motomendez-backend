module.exports = (app) => {
  const _app = app;
  const PcdBeneficioModel = app.src.db.models.pcd_beneficio;
  const PcdBeneficioMesModel = app.src.db.models.pcd_beneficio_mes;
  const BeneficioModel = app.src.db.models.beneficio;
  const PcdBeneficioLogModel = app.src.db.models.pcd_beneficio_log;

  /**
   * crearPcdBeneficio - Método para crear un pcd_beneficio
   * @param {Object} datosPcdBeneficio
   * @return {Promise}
   */
  const crearPcdBeneficio = (datosPcdBeneficio) => {
    return PcdBeneficioModel.create(datosPcdBeneficio);
  };

  /**
   * crearPcdBeneficioMes - Método para crear un pcd_beneficio_mes
   * @param {Object} datosPcdBeneficioMes
   * @return {Promise}
   */
  const crearPcdBeneficioMes = (datosPcdBeneficioMes) => {
    return PcdBeneficioMesModel.create(datosPcdBeneficioMes);
  };

  /**
   * actualizarPcdBeneficio - Método para actualizar un pcd_beneficio
   * @param {Object} datosPcdBeneficio
   * @return {Promise}
   */
  const actualizarPcdBeneficio = (pcdBenefico, parametros) => {
    return pcdBenefico.updateAttributes(parametros);
  };

  /**
   * buscarBeneficio - Método para obtener un beneficio a partir del rol
   * @param {number} datos
   * @return {Promise}
   */
  const buscarBeneficio = (datos) => {
    const query = {
      where: {
        fid_rol: datos.id_rol,
        estado: 'ACTIVO',
      },
      raw: true,
    };
    return BeneficioModel.find(query);
  };

   /**
   * buscarPcdBeneficio - Método para obtener pcd_beneficio en base a parametros
   * Modificado raw: false
   * @return {Promise}
   */
  const buscarPcdBeneficio = (parametros) => {
    const query = {
      where: parametros,
    };
    return PcdBeneficioModel.findOne(query);
  };

  /**
   * buscarPcdBeneficio - Método para obtener pcd_beneficio en base a parametros
   * Modificado raw: false
   * @return {Promise}
   */
  const buscarPcdBeneficioLog = (parametros) => {
    const query = {
      where: parametros,
    };
    return PcdBeneficioLogModel.findOne(query);
  };

   /**
   * buscarPcdBeneficioMes - Método para obtener pcd_beneficio en base a parametros
   * Modificado raw: false
   * @return {Promise}
   */
  const buscarPcdBeneficioMes = (parametros) => {
    const query = {
      where: parametros,
    };
    return PcdBeneficioMesModel.findOne(query);
  };

  /**
   * crearPcdBeneficioLog - Método para crear un pcd_beneficio_log
   * @param {Object} datosPcdBeneficio
   * @return {Promise}
   */
  const crearPcdBeneficioLog = (datosPcdBeneficio) => {
    return PcdBeneficioLogModel.create(datosPcdBeneficio);
  };

  _app.dao.pcd_beneficio = {
    crearPcdBeneficio,
    actualizarPcdBeneficio,
    buscarBeneficio,
    buscarPcdBeneficio,
    crearPcdBeneficioLog,
    crearPcdBeneficioMes,
    buscarPcdBeneficioMes,
    buscarPcdBeneficioLog,
  };
};
