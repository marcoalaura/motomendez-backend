
module.exports = (app) => {
  const _app = app;
  _app.controller.rol = {};
  const rolController = _app.controller.rol;
  const RolModel = app.src.db.models.rol;

  const sequelize = app.src.db.sequelize;

  async function getRol(req, res) {
    if (req.query.limit && req.query.page) {
      req.query.offset = (req.query.page - 1) * req.query.limit;
    }
    if (req.query.filter) {
      req.query.where = { estado: 'ACTIVO', nombre: { $iLike: `%${req.query.filter}%` } };
    } else {
      req.query.where = { estado: 'ACTIVO' };
    }
    if (req.query.order) {
      if (req.query.order.charAt(0) == '-') {
        req.query.order = `${req.query.order.substring(1, req.query.order.length)} DESC`;
      }
    }
    req.query.where.id_rol = { $notIn: [5] }; // SERVICIO_OVT
    if (req.body.audit_usuario.id_rol !== 1) {
      req.query.where.id_rol.$notIn.push(1); // ADMIN
    }
    try {
      const dataRol = await RolModel.findAndCountAll(req.query);
      if (dataRol != null && dataRol.length !== 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente',
          datos: dataRol,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron roles registrados.',
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

  rolController.get = getRol;
  async function getRolId(req, res) {
    const idRol = req.params.id;
    try {
      const dataRol = await RolModel.findById(idRol);
      if (dataRol) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente.',
          datos: dataRol,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No existe el rol solicitado.',
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

  rolController.getId = getRolId;

  async function createRol(req, res) {
    const rolCrear = req.body;
    rolCrear._usuario_creacion = rolCrear.audit_usuario.usuario;
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const dataRol = await RolModel.create(rolCrear);
        if (dataRol) {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente',
            datos: dataRol,
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

  rolController.post = createRol;

  async function updateRol(req, res) {
    const rol = req.body;
    const idRol = req.params.id;
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const dataRol = await RolModel.findById(idRol);
        if (dataRol) {
          rol._usuario_modificacion = rol.audit_usuario.usuario;
          const resRol = await dataRol.updateAttributes(rol);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente',
            datos: resRol,
          });
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No existe el rol solicitado.',
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
  rolController.put = updateRol;
};
