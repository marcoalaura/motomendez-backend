module.exports = (app) => {
  const _app = app;

  const obtenerListadoGrupo = async (req, res) => {
    try {
      const parametro = await app.dao.parametro.obtenerListadoGrupo(req.query.grupo);
      if (parametro && parametro.rows.length > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: parametro.count,
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

  _app.controller.parametro = {
    obtenerListadoGrupo,
  };
};
