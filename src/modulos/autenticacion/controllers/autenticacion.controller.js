import jwt from 'jwt-simple';
import crypto from 'crypto';

module.exports = (app) => {
  const _app = app;
  _app.controller.autenticacion = {};

  async function autenticar(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(412).json({
        finalizado: false,
        mensaje: 'Los datos Usuario y Contraseña son obligatorios',
        datos: {},
      });
    }
    const email = req.body.username;
    const contrasena = req.body.password;
    const password = crypto.createHash('md5').update(contrasena).digest('hex');
    try {
      const data = await obtenerDatos(email, password);
      res.status(200).json(data);
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  }

  async function obtenerDatos(email, password, auditUsuario, idRolSolicitado) {
    let rolDevuelto;
    let condiciones = {};
    const rolesAdicionales = [];
    if (auditUsuario && auditUsuario.id_usuario) {
      condiciones = {
        id_usuario: auditUsuario.id_usuario,
        estado: 'ACTIVO',
      };
    } else {
      condiciones = {
        usuario: email,
        contrasena: password,
        estado: 'ACTIVO',
      };
    }
    try {
      const datosUsuario = await app.dao.autenticacion.buscarUsuario(condiciones);
      if (datosUsuario && datosUsuario.id_usuario) {
        const datosUsuarioRol = await app.dao.autenticacion.buscarUsuarioRol(datosUsuario.id_usuario);
        if (datosUsuarioRol.length > 0) {
          if (!idRolSolicitado) {
            let rolDefecto = datosUsuarioRol[0];
            datosUsuarioRol.forEach((r) => {
              if (r.rol.peso < rolDefecto.rol.peso) {
                rolDefecto = r;
              }
            });
            datosUsuarioRol.forEach((r) => {
              if (r.fid_rol !== rolDefecto.fid_rol) {
                rolesAdicionales.push(r.rol);
              }
            });
            rolDevuelto = rolDefecto;
          } else {
            datosUsuarioRol.forEach((r) => {
              if (r.fid_rol === idRolSolicitado) {
                rolDevuelto = r;
              } else {
                rolesAdicionales.push(r.rol);
              }
            });
            if (!rolDevuelto || !rolDevuelto.fid_rol) {
              throw new Error('No cuenta con privilegios para el rol solicitado.');
            }
            return rolDevuelto;
          }
          const datosRolMenu = await app.dao.autenticacion.buscarRolMenu(rolDevuelto.fid_rol);
          if (datosRolMenu) {
            const datosRespuesta = await armarRespuesta(datosRolMenu, datosUsuario, rolDevuelto, rolesAdicionales);
            return datosRespuesta;
          }
        } else {
          throw new Error('El usuario no tiene asignado ningún rol.');
        }
      }
    } catch (error) {
      throw new Error(error);
    }
    return false;
  }

  async function armarRespuesta(rolMenu, usuario, rolDevuelto, rolesAdicionales) {
    let menuEntrar1 = null;
    const menusDevolverAux = [];
    for (let rm = 0; rm < rolMenu.length; rm += 1) {
      // Obteniendo al padre
      const padre = rolMenu[rm].menu.menu_padre;
      const objPadre = JSON.stringify(padre);
      let existe = false;
      for (let i = 0; i < menusDevolverAux.length; i += 1) {
        if (JSON.stringify(menusDevolverAux[i]) === objPadre) {
          existe = true;
          break;
        }
      }
      if (!existe) {
        menusDevolverAux.push(padre);
      }
    }
    const menusDevolver = [];
    for (let padreI = 0; padreI < menusDevolverAux.length; padreI += 1) {
      const padre = JSON.parse(JSON.stringify(menusDevolverAux[padreI]));
      padre.submenu = [];
      if (padre.url && !menuEntrar1) {
        menuEntrar1 = `/${padre.url}`;
      }
      for (let rmI = 0; rmI < rolMenu.length; rmI += 1) {
        if (padre.id_menu === rolMenu[rmI].menu.fid_menu_padre) {
          const hijo = JSON.parse(JSON.stringify(rolMenu[rmI].menu));
          delete hijo.menu_padre;
          hijo.permissions = {};
          hijo.permissions.read = rolMenu[rmI].method_get;
          hijo.permissions.create = rolMenu[rmI].method_post;
          hijo.permissions.update = rolMenu[rmI].method_put;
          hijo.permissions.delete = rolMenu[rmI].method_delete;
          padre.submenu.push(hijo);
          if (!menuEntrar1) {
            menuEntrar1 = `/${hijo.url}`;
          }
        }
      }
      menusDevolver.push(padre);
    }
    // Aqui buscar al Menu de usuario
    const ven = new Date();
    ven.setDate(ven.getDate() + 1);
    const payload = {
      id_usuario: usuario.id_usuario,
      usuario: usuario.usuario,
      id_rol: rolDevuelto ? rolDevuelto.fid_rol : 0,
      id_persona: usuario.persona.id_persona,
      vencimiento: ven,
    };
    const usuarioEnviar = {
      id_usuario: usuario.id_usuario,
      dpa: usuario.cod_municipio,
      nombres: usuario.persona.nombres,
      apellidos: `${usuario.persona.primer_apellido} ${usuario.persona.segundo_apellido}`,
      email: usuario.email,
      usuario: usuario.usuario,
      rol: rolDevuelto.rol.nombre,
      estado: usuario.estado,
      roles: rolesAdicionales,
    };
    if (usuario.dpa && usuario.dpa.municipio) {
      usuarioEnviar.municipio = usuario.dpa.municipio;
    }
    const resultado = {
      finalizado: true,
      mensaje: 'Obtención de datos exitoso.',
      token: jwt.encode(payload, app.settings.secretAGETIC),
      datos: {
        usuario: usuarioEnviar,
        menu: menusDevolver,
        menuEntrar: menuEntrar1,
      },
    };
    return resultado;
  }

  _app.controller.autenticacion.post = autenticar;
};
