module.exports = (app) => {
  const _app = app;
  const ControlApi = app.src.db.models.control_api;

  /**
   * Devuelve detalles de control api segun id
   * @param {string} gestion
   */
  const detalleControlApi = (where) => {
    const query = { where };
    return ControlApi.findOne(query);
  };


    /**
   * Devuelve detalles de control api segun id_control_api
   * @param {string} gestion
   */
  const detalleControlApiPorId = (tipo, idControlApi) => {
    const query = { where: {
      tipo_api: tipo,
      id_control_api: idControlApi,
    } };
    return ControlApi.findOne(query);
  };

  const actualizarPasosControlApi = async (id, controlApiActualizado) => {
    if (id) {
      const query = {
        where: {
          id_control_api: id,
        }
      };
      return ControlApi.update(controlApiActualizado, query);
    } else {
      return ControlApi.create(controlApiActualizado);
    }
  };

  _app.dao.controlApi = {
    detalleControlApi,
    detalleControlApiPorId,
    actualizarPasosControlApi,
  };
};
