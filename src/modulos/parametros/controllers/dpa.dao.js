module.exports = (app) => {
  const _app = app;
  const DpaModel = app.src.db.models.dpa;

  /**
   * obteneridDpa - Método para obtener el Id de dpa segun codigo Municipio
   * @param {number} codigoMunicipio
   * @return {Promise}
   */
  const obtenerIdDpa = (codigoMunicipio) => {
    const query = {
      attributes: ['cod_municipio', 'municipio'],
      where: {
        cod_municipio: codigoMunicipio,
      },
    };
    return DpaModel.findOne(query);
  };

  /**
   * obtenerDepartamentos - Método para obtener el listado de departamentos
   * @return {Promise}
   */
  const obtenerDepartamentos = () => {
    const query = {
      attributes: ['cod_departamento', 'departamento'],
      where: {
        estado: 'ACTIVO',
      },
      group: ['dpa.cod_departamento', 'dpa.departamento'],
      order: 'dpa.departamento ASC',
    };
    return DpaModel.findAndCountAll(query);
  };

  /**
   * obtenerProvinciasId - Método para obtener las provincias relacionadas a un departamento
   * @param {number} idDepartamento
   * @return {Promise}
   */
  const obtenerProvinciasId = (idDepartamento) => {
    const query = {
      attributes: ['cod_provincia', 'provincia'],
      where: {
        estado: 'ACTIVO',
        cod_departamento: {
          $like: `${idDepartamento}`,
        },
      },
      group: ['dpa.cod_provincia', 'dpa.provincia'],
      order: 'dpa.provincia ASC',
    };
    return DpaModel.findAndCountAll(query);
  };

  /**
   * obtenerMunicipioId - Método para obtener los municipios relacionados a una provincia
   * @param {number} idProvincia
   * @retutn {Promise}
   */
  const obtenerMunicipioId = (idProvincia) => {
    const query = {
      attributes: ['cod_municipio', 'municipio'],
      where: {
        estado: 'ACTIVO',
        cod_provincia: {
          $like: `${idProvincia}`,
        },
      },
      order: 'dpa.municipio ASC',
    };
    return DpaModel.findAndCountAll(query);
  };
  
  /**
   * verificarExisteDepartamento - Método para verificar si codigo de departamento es valido
   * @param {number} idDpa
   * @return {Promise}
   */
  const verificarExisteDepartamento = (idDpa) => {
    const query = {
      where: {
        cod_departamento: idDpa,
      },
    };
    return DpaModel.findOne(query);
  };
  
  /**
   * verificarExisteProvincia - Método para verificar si codigo de provincia es valido
   * @param {number} idDpa
   * @return {Promise}
   */
  const verificarExisteProvincia = (idDpa) => {
    const query = {
      where: {
        cod_provincia: idDpa,
      },
    };
    return DpaModel.findOne(query);
  };

  const buscarMunicipio = (nombre) => {
    const query = {
      attributes: ['cod_municipio', 'municipio', 'provincia', 'departamento'],
      where: {
        municipio: {
          $iLike: `%${nombre}%`,
        },
      },
    };
    return DpaModel.findAndCountAll(query);
  };

  _app.dao.dpa = {
    obtenerIdDpa,
    obtenerDepartamentos,
    obtenerProvinciasId,
    verificarExisteDepartamento,
    verificarExisteProvincia,
    obtenerMunicipioId,
    buscarMunicipio,
  };
};
