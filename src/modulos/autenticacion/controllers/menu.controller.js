
module.exports = (app) => {
  const _app = app;
  _app.controller.menu = {};
  const menuController = _app.controller.menu;
  const MenuModel = app.src.db.models.menu;

  const sequelize = app.src.db.sequelize;

  async function getMenu(req, res) {
    if (req.query.limit && req.query.page) {
      req.query.offset = (req.query.page - 1) * req.query.limit;
    }
    if (req.query.filter) {
      req.query.where = { estado: 'ACTIVO', nombre: { $iLike: `%${req.query.filter}%` } };
    } else {
      req.query.where = { estado: 'ACTIVO' };
    }
    if (req.query.order) {
      if (req.query.order.charAt(0) === '-') {
        req.query.order = `${req.query.order.substring(1, req.query.order.length)} DESC`;
      }
    }
    try {
      const dataMenu = await MenuModel.findAndCountAll(req.query);
      if (dataMenu) {
        if (dataMenu !== null && dataMenu.length !== 0) {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente',
            datos: dataMenu,
          });
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No se encontraron los menús solicitados.',
            datos: {},
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

  menuController.get = getMenu;

  async function getMenuId(req, res) {
    const idRol = req.params.id;
    try {
      const dataMenu = await MenuModel.buscarPorId(idRol);
      if (dataMenu) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente.',
          datos: dataMenu,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No existe menu solicitado.',
          datos: dataMenu,
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: true,
        mensaje: error.message,
        datos: {},
      });
    }
  }

  menuController.getId = getMenuId;

  async function createMenu(req, res) {
    const menuCrear = req.body;
    app.dao.common.crearTransaccion(async (t) => {
      menuCrear._usuario_creacion = menuCrear.audit_usuario.usuario;
      try {
        const dataMenu = await MenuModel.create(menuCrear);
        if (dataMenu) {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente',
            datos: dataMenu,
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

  menuController.post = createMenu;

  async function updateMenu(req, res) {
    const menu = req.body;
    const idMenu = req.params.id;
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const dataMenu = await MenuModel.findById(idMenu);
        if (dataMenu) {
          menu._usuario_modificacion = req.body.audit_usuario.usuario;
          const resMenu = await dataMenu.updateAttributes(menu);
          if (resMenu) {
            res.status(200).json({
              finalizado: true,
              mensaje: 'Datos obtenidos exitosamente',
              datos: resMenu,
            });
          }
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No existe menú solicitado.',
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
  menuController.put = updateMenu;
};
