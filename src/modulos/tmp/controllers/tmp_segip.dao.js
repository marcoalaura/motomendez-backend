module.exports = (app) => {
  const _app = app;
  const TmpSegipModel = app.src.db.models.tmp_segip;

  /**
   * vertificarPersona - Método para verificar si la persona ya esta validada con SEGIP
   * @param {object} datosPersona
   */
  const verificarPersona = (datosPersona) => {
    const query = {
      attributes: [['NOMBRES_CIUDADANO', 'nombres'], ['PRIMER_APELLIDO', 'primer_apellido'], ['SEGUNDO_APELLIDO', 'segundo_apellido']],
      where: {
        CEDULA_IDENTIDAD: datosPersona.documento_identidad,
        FECHA_DE_NACIMIENTO: datosPersona.fecha_nacimiento,
      },
    };
    return TmpSegipModel.findOne(query);
  };
  _app.dao.tmpSegip = {
    verificarPersona,
  };
};
