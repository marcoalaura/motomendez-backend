module.exports = (app) => {
  const _app = app;
  const DomicilioModel = app.src.db.models.domicilio;
  const PersonaModel = app.src.db.models.persona;
  const DpaModel = app.src.db.models.dpa;

  const obtenerDomicilio = (ci, fechaNacimiento, gestion) => {
    const query = {
      attributes: ['id_domicilio'],
      where: {
        documento_identidad: ci,
        fecha_nacimiento: fechaNacimiento,
        gestion
      }
    };
    return DomicilioModel.findAll(query);
  };

  const listar = (gestion) => {
    const query = {
      attributes: ['id_domicilio', 'direccion', 'ci_solicitante', 'solicitante', 'documento_siprun', '_fecha_creacion'],
      where: {
        gestion
      },
      order: 'id_domicilio',
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['documento_identidad', 'fecha_nacimiento', 'complemento_documento', 'primer_apellido', 'segundo_apellido', 'nombres', 'casada_apellido', 'expedido'],
          requerid: true
        },
        {
          model: DpaModel,
          as: 'pcd_dpa_nuevo',
          attributes: ['cod_municipio', 'municipio', 'cod_provincia', 'provincia', 'cod_departamento', 'departamento'],
          requerid: true
        }
      ]
      // ,raw: true
    };
    return DomicilioModel.findAll(query);
  };

  /**
   * crearDomicilio - Método para crear un Domicilio
   * @param {Object} datosDomicilio
   * @return {Promise}
   */
  const crearDomicilio = (datosDomicilio) => {
    return DomicilioModel.create(datosDomicilio);
  };

  _app.dao.domicilio = {
    obtenerDomicilio,
    listar,
    crearDomicilio
  };
};
