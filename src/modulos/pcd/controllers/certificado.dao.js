module.exports = (app) => {
  const _app = app;
  const CertificadoModel = app.src.db.models.certificado;

  /**
   * obtenerNroRegistro - Método para verificar si un certificado con fecha de expiracion ya existe
   * @param {date} fechaVigencia
   * @param {number} idPcd
   * @param {string} tipo
   */
  const obtenerNroRegistro = (fechaVigencia, idPcd, tipo) => {
    const query = {
      where: {
        fecha_vigencia: fechaVigencia,
        fid_pcd: idPcd,
        tipo_certificado: tipo,
      },
    };
    return CertificadoModel.findOne(query);
  };

  _app.dao.certificado = {
    obtenerNroRegistro,
  };
};
