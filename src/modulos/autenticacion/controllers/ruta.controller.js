module.exports = (app) => {
  const _app = app;
  _app.controller.ruta = {};
  const RutaModel = app.src.db.models.ruta;
  const sequelize = app.src.db.sequelize;

  async function getRuta(req, res) {
    if (req.query.limit && req.query.page) {
      req.query.offset = (req.query.page - 1) * req.query.limit;
    }
    if (req.query.filter) {
      req.query.where = { estado: 'ACTIVO', ruta: { $iLike: `%${req.query.filter}%` } };
    } else {
      req.query.where = { estado: 'ACTIVO' };
    }
    if (req.query.order) {
      if (req.query.order.charAt(0) === '-') {
        req.query.order = `${req.query.order.substring(1, req.query.order.length)} DESC`;
      }
    }
    try {
      const dataRutas = await RutaModel.findAndCountAll(req.query);
      if (dataRutas) {
        if (dataRutas != null && dataRutas.length !== 0) {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente.',
            datos: dataRutas,
          });
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No se encontraron rutas registradas.',
            datos: dataRutas,
          });
        }
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  }

  async function getRutaId(req, res) {
    try {
      const idRuta = req.params.id;
      const dataRuta = await RutaModel.findById(idRuta);
      if (dataRuta) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente',
          datos: dataRuta,
        });
      } else {
        res.status(204).json({
          finalizado: false,
          mensaje: 'No existe la ruta solicitada',
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
  }

  async function createRuta(req, res) {
    const rutaNueva = req.body;
    rutaNueva._usuario_creacion = rutaNueva.audit_usuario.id_usuario;
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const dataRuta = await RutaModel.create(rutaNueva);
        res.status(201).json({
          finalizado: true,
          mensaje: 'Datos creados exitosamente.',
          datos: dataRuta,
        });
      } catch (error) {
        res.status(412).json({
          finalizado: false,
          mensaje: error.message,
          datos: {},
        });
      }
    });
  }

  async function updateRuta(req, res) {
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const rutaActualizar = req.body;
        const idRuta = req.params.id;
        const ruta = await RutaModel.findById(idRuta);
        if (ruta) {
          const data = await ruta.updateAttributes(rutaActualizar);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos actualizados exitosamente.',
            datos: data,
          });
        } else {
          res.status(204).json({
            finalizado: false,
            mensaje: 'No existe la ruta solicitada',
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
    });
  }
  _app.controller.ruta.get = getRuta;
  _app.controller.ruta.getId = getRutaId;
  _app.controller.ruta.post = createRuta;
  _app.controller.ruta.put = updateRuta;
};
