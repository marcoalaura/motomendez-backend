module.exports = (app) => {
  const _app = app;
  _app.controller.rolRuta = {};
  const rolRutaController = _app.controller.rolRuta;
  const RolRutaModel = app.src.db.models.rol_ruta;
  const RutaModel = app.src.db.models.ruta;
  const sequelize = app.src.db.sequelize;

  async function getRolRutaId(req, res) {
    try {
      const dataRuta = await RutaModel.buscar({ estado: 'ACTIVO' });
      if (dataRuta.length > 0) {
        const dataRolRuta = await RolRutaModel.findAll({ where: { fid_rol: req.params.id } });
        if (dataRolRuta.length !== 0) {
          const permisosRutas = establecerRutasPermisos(dataRuta, dataRolRuta);
          if (permisosRutas) {
            res.status(200).json({
              finalizado: true,
              mensaje: 'Datos obtenidos exitosamente.',
              datos: permisosRutas,
            });
          }
        } else {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Datos obtenidos exitosamente.',
            datos: dataRuta,
          });
        }
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros de rutas.',
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
  rolRutaController.getId = getRolRutaId;

  function establecerRutasPermisos(rutas, rolesRutas) {
    let ruta;
    const rutasPermisos = rutas;
    for (let i = 0; i < rutas.length; i += 1) {
      ruta = rutas[i];
      for (let k = 0; k < rolesRutas.length; k += 1) {
        if (ruta.id_ruta === rolesRutas[k].fid_ruta) {
          if (rolesRutas[k].method_get) {
            rutasPermisos[i].dataValues.get = true;
          }
          if (rolesRutas[k].method_post) {
            rutasPermisos[i].dataValues.post = true;
          }
          if (rolesRutas[k].method_put) {
            rutasPermisos[i].dataValues.put = true;
          }
          if (rolesRutas[k].method_delete) {
            rutasPermisos[i].dataValues.delete = true;
          }
        }
      }
      if (i + 1 === rutas.length) {
        return rutasPermisos;
      }
    }
    return rutasPermisos;
  }

  async function createRolRuta(req, res) {
    const rutas = req.body; // array de rutas
    let rolRuta;
    const rolesRutas = [];
    for (let i = 0; i < rutas.length; i += 1) {
      rolRuta = {
        fid_rol: req.params.id,
        _usuario_creacion: req.body.audit_usuario.usuario,
      };
      if (crearRutasPermisos(rolRuta, rutas[i])) {
        // guardamos la relacion
        rolRuta.fid_ruta = rutas[i].id_ruta;
        rolesRutas.push(rolRuta);
      }
    }
    app.dao.common.crearTransaccion(async (t) => {
      try {
        const dataRolRuta = await RolRutaModel.destroy({ where: { fid_rol: req.params.id } });
        if (dataRolRuta) {
          if (rolesRutas.length !== 0) {
            const resRolRuta = await RolRutaModel.bulkCreate(rolesRutas);
            if (resRolRuta) {
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
  rolRutaController.post = createRolRuta;

  function crearRutasPermisos(rolRuta, rutas) {
    const rolRutaPermiso = rolRuta;
    let ruta = false;
    if (rutas.hasOwnProperty('get') && rutas.get) {
      rolRutaPermiso.method_get = true;
      ruta = true;
    }
    if (rutas.hasOwnProperty('post') && rutas.post) {
      rolRutaPermiso.method_post = true;
      ruta = true;
    }
    if (rutas.hasOwnProperty('put') && rutas.put) {
      rolRutaPermiso.method_put = true;
      ruta = true;
    }
    if (rutas.hasOwnProperty('delete') && rutas.delete) {
      rolRutaPermiso.method_delete = true;
      ruta = true;
    }
    if (ruta) {
      return rolRutaPermiso;
    }
    return null;
  }
};
