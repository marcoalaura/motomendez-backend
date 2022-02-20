module.exports = (app) => {
  const _app = app;
  const PersonaModel = app.src.db.models.persona;

  /**
   * crearPersona - Método para crear una persona
   * @param {Object} datosPersona
   * @return {Promise}
   */
  const crearPersona = (datosPersona) => {
    return PersonaModel.create(datosPersona);
  };

  /**
   * actualizarPersona - Método para actualizar datos de Persona
   * @param {number} idPersona
   * @param {Object} datosPersona
   */
  const actualizarPersona = (idPersona, datosPersona) => {
    const query = {
      where: {
        id_persona: idPersona,
      },
    };
    return PersonaModel.update(datosPersona, query);
  };

  /**
   * buscarPersona - Método para buscar datos de Persona
   * @param {Object} documento_identidad
   */
  const buscarPersona = (datosPersona) => {
    const query = {
      where: datosPersona,
    };
    return PersonaModel.findOne(query);
  };

  _app.dao.persona = {
    crearPersona,
    actualizarPersona,
    buscarPersona,
  };
};
