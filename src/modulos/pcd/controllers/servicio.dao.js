module.exports = (app) => {
  const _app = app;
  const PcdModel = app.src.db.models.pcd;
  const CertificadoModel = app.src.db.models.certificado;
  const PersonaModel = app.src.db.models.persona;
  const DpaModel = app.src.db.models.dpa;
  const IbcModel = app.src.db.models.tmp_ibc;

  /**
   * obtenerPcd - Método para obtener persona con discapacidad
   * @return {Promise}
   */
  const obtenerPcd = (parametros) => {
    const query = {
      where: {
        estado: 'ACTIVO',
      },
      attributes: ['id_pcd', 'observacion'],
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['nombre_completo', 'fecha_nacimiento', 'documento_identidad', 'complemento_documento', 'correo_electronico', 'direccion', 'telefono', 'sexo'],
          where: parametros,
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: ['cod_municipio', 'municipio', 'provincia', 'departamento'],
          requerid: true,
        },
      ],
    };
    return PcdModel.findAll(query);
  };

  /**
   * obtenerCertificado - Método para obtener el id_certificado del certificado con vigencia mas alta
   * @return {Promise}
   */
  const obtenerCertificadoMax = (idPcd) => {
    const query = {
      where: {
        fid_pcd: idPcd,
      },
      attributes: [[app.src.db.sequelize.fn('max', app.src.db.sequelize.col('fecha_vigencia')), 'fecha_vigencia']],
    };
    return CertificadoModel.findOne(query);
  };

  /**
   * obtenerCertificado - Método para obtener certificado de la persona con discapacidad
   * @return {Promise}
   */
  const obtenerCertificado = (idPcd, certificado) => {
    const query = {
      where: {
        fid_pcd: idPcd,
        fecha_vigencia: certificado.fecha_vigencia,
      },
      attributes: ['tipo_certificado', 'numero_registro', 'tipo_discapacidad', 'grado_discapacidad', 'porcentaje_discapacidad', 'fecha_vigencia', 'fecha_emision'],
    };
    return CertificadoModel.findOne(query);
  };

  /**
   * listarIbc - Método para obtener listado de personas con discapacidad del IBC
   * @return {Promise}
   */
  const listarIbc = () => {
    const query = {
      attributes: [
        ['ci_afiliado', 'ci'],
        // 'ci_exp',
        ['ap_pat', 'ap_paterno'],
        ['ap_mat', 'ap_materno'],
        // 'ap_tres',
        [app.src.db.sequelize.fn('concat', app.src.db.sequelize.col('nombre1'), ' ',
        app.src.db.sequelize.col('nombre2')), 'nombres'],
        'fecha_nac',
      ],
      raw: true,
    };
    return IbcModel.findAndCountAll(query);
  };

  _app.dao.servicio = {
    obtenerPcd,
    obtenerCertificadoMax,
    obtenerCertificado,
    listarIbc,
  };
};
