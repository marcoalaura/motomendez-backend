module.exports = (app) => {
  const _app = app;
  _app.controller.rolMenu = {};
  const rolMenuController = _app.controller.rolMenu;
  const RolMenuModel = app.src.db.models.rol_menu;
  const MenuModel = app.src.db.models.menu;
  const sequelize = app.src.db.sequelize;

  async function getRolMenuId(req, res) {
    try {
      const dataMenu = await MenuModel.buscarMenusSubmenus();
      if (dataMenu.length > 0) {
        const dataRolMenu = await RolMenuModel.findAll({ where: { fid_rol: req.params.id } });
        if (dataRolMenu.length !== 0) {
          const dataPermisos = establecerMenusPermisos(dataMenu, dataRolMenu);
          if (dataPermisos) {
            res.status(200).json({
              finalizado: true,
              mensaje: 'Datos obtenidos exitosamente.',
              datos: dataPermisos,
            });
          }
        } else {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente',
            datos: dataMenu,
          });
        }
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros de menús.',
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
  rolMenuController.getId = getRolMenuId;

  function establecerMenusPermisos(menus, rolesMenus) {
    let menu;
    let submenus;
    let submenu;
    const menusPermisos = menus;
    for (let i = 0; i < menus.length; i += 1) {
      menu = menus[i];
      if (menu.submenus.length > 0) {
        submenus = menu.submenus;
        for (let j = 0; j < submenus.length; j += 1) {
          submenu = submenus[j];
          for (let k = 0; k < rolesMenus.length; k += 1) {
            if (submenu.id_menu === rolesMenus[k].fid_menu) {
              if (rolesMenus[k].method_get) {
                menusPermisos[i].submenus[j].dataValues.get = true;
              }
              if (rolesMenus[k].method_post) {
                menusPermisos[i].submenus[j].dataValues.post = true;
              }
              if (rolesMenus[k].method_put) {
                menusPermisos[i].submenus[j].dataValues.put = true;
              }
              if (rolesMenus[k].method_delete) {
                menusPermisos[i].submenus[j].dataValues.delete = true;
              }
            }
          }
        }
      }
      if (i + 1 === menus.length) {
        return menusPermisos;
      }
    }
    return menusPermisos;
  }

  async function createRolMenu(req, res) {
    const menus = req.body; // array de menus
    let rolMenu;
    let rolSubMenu;
    const rolesMenus = [];
    for (let i = 0; i < menus.length; i += 1) {
      rolMenu = {
        fid_rol: req.params.id,
        _usuario_creacion: req.body.audit_usuario.usuario,
      };
      if (crearMenusPermisos(rolMenu, menus[i])) {
        // guardamos la relacion
        rolMenu.fid_menu = menus[i].id_menu;
        rolesMenus.push(rolMenu);
      }
      // verifica submenus
      if (menus[i].submenus.length !== 0) {
        for (let j = 0; j < menus[i].submenus.length; j += 1) {
          rolSubMenu = {
            fid_rol: req.params.id,
            _usuario_creacion: req.body.audit_usuario.usuario,
          };
          if (crearMenusPermisos(rolSubMenu, menus[i].submenus[j])) {
            // guardamos la relacion
            rolSubMenu.fid_menu = menus[i].submenus[j].id_menu;
            rolesMenus.push(rolSubMenu);
          }
        }
      }
    }
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const dataRolMenu = await RolMenuModel.destroy({ where: { fid_rol: req.params.id } });
        if (dataRolMenu) {
          if (rolesMenus.length !== 0) {
            const resRolMenu = await RolMenuModel.bulkCreate(rolesMenus);
            if (resRolMenu) {
              res.status(200).json({
                finalizado: true,
                mensaje: 'Modificación exitosa.',
                datos: {},
              });
            }
          }
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

  function crearMenusPermisos(rolMenu, menus) {
    const rolMenuPermiso = rolMenu;
    let menu = false;
    if (menus.hasOwnProperty('get') && menus.get) {
      rolMenuPermiso.method_get = true;
      menu = true;
    }
    if (menus.hasOwnProperty('post') && menus.post) {
      rolMenuPermiso.method_post = true;
      menu = true;
    }
    if (menus.hasOwnProperty('put') && menus.put) {
      rolMenuPermiso.method_put = true;
      menu = true;
    }
    if (menus.hasOwnProperty('delete') && menus.delete) {
      rolMenuPermiso.method_delete = true;
      menu = true;
    }
    if (menu) {
      return rolMenuPermiso;
    }
    return null;
  }
  rolMenuController.post = createRolMenu;
};
