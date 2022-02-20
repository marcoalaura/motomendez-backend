module.exports = (app) => {
  const _app = app;

  const obtenerDepartamentos = async (req, res) => {
    try {
      const parametro = await app.dao.dpa.obtenerDepartamentos();
      if (parametro) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: parametro.rows.length,
            rows: parametro.rows,
          },
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No existe el recurso solicitado.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerProvincias = async (req, res) => {
    try {
      const obtenerIdProvincia = await app.dao.dpa.verificarExisteDepartamento(req.params.id_departamento);
      if (obtenerIdProvincia) {
        const provincias = await app.dao.dpa.obtenerProvinciasId(req.params.id_departamento);
       // const formatParametro = agrupa(provincias.rows, 'provincia');
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: provincias.rows.length,
            rows: provincias.rows,
          },
        });
      } else {
        throw new Error('No existe el recurso solicitado');
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerMunicipios = async (req, res) => {
    try {
      const obtenerIdMunicipio = await app.dao.dpa.verificarExisteProvincia(req.params.id_provincia);
      if (obtenerIdMunicipio) {
        const provincias = await app.dao.dpa.obtenerMunicipioId(req.params.id_provincia);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: provincias.count,
            rows: provincias.rows,
          },
        });
      } else {
        throw new Error('No existe el recurso solicitado');
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const buscarMunicipio = async (req, res) => {
    try {
      const datos = await app.dao.dpa.buscarMunicipio(req.query.nombre);
      if (datos) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de datos exitoso.',
          datos,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No existe el recurso solicitado.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.dpa = {
    obtenerDepartamentos,
    obtenerProvincias,
    obtenerMunicipios,
    buscarMunicipio,
  };
};
