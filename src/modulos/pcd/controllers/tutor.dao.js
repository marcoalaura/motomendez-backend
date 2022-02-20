module.exports = (app) => {
  const _app = app;
  const TutorModel = app.src.db.models.tutor;

  /**
   * obtenerTutores - Método para obtencion de Tutores en estado ACTIVO
   * @param {number} idPcd
   * @return {Promise}
   */
  const obtenerTutores = (idPcd) => {
    const query = {
      attributes: ['id_tutor'],
      where: {
        fid_pcd: idPcd,
        estado: 'ACTIVO',
      },
    };
    return TutorModel.findAndCountAll(query);
  };

  /**
   * actualizarTutores - Método para actualizar el estado del anterior Tutor
   * @param {number} idPcd
   * @param {number} usuarioModificacion
   * @return {Promise}
   */
  const actualizarTutores = (idPcd, usuarioModificacion) => {
    const datos = {
      estado: 'INACTIVO',
      _usuario_modificacion: usuarioModificacion,
    };
    const query = {
      where: {
        fid_pcd: idPcd,
        estado: 'ACTIVO',
      },
    };
    return TutorModel.update(datos, query);
  };

  /**
   * crearTutor - Método para crear un Tutor
   * @param {Object} datosTutor
   * @return {Promise}
   */
  const crearTutor = (datosTutor) => {
    return TutorModel.create(datosTutor);
  };

  const obtenerTutor = (parametros) => {
    return TutorModel.findOne(parametros);
  };

  const obtenerAllTutores = async (parametros) => {
    try {
      const tutores = await TutorModel.findAll(parametros);
      return tutores;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const modificarDocumentoRuta = async (idTutor, documentoRuta, usuarioModificacion) => {
    try {
      const datos = {
        documento_ruta: documentoRuta,
        _usuario_modificacion: usuarioModificacion,
      };
      const query = {
        where: {
          id_tutor: idTutor,
        },
      };
      return await TutorModel.update(datos, query);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  _app.dao.tutor = {
    obtenerTutores,
    actualizarTutores,
    crearTutor,
    obtenerTutor,
    obtenerAllTutores,
    modificarDocumentoRuta,
  };
};
