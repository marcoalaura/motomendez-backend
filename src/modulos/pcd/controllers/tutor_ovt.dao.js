module.exports = (app) => {
  const _app = app;
  const TutorOVTModel = app.src.db.models.tutor_ovt;

  const crearTutorOvt = (datosTutor) => {
    return TutorOVTModel.create(datosTutor);
  };

  const obtenerTutorOvt = (parametros) => {
    return TutorOVTModel.findOne({
      where: parametros,
    });
  };

  _app.dao.tutor_ovt = {
    crearTutorOvt,
    obtenerTutorOvt,
  };
};
