import handlebars from 'handlebars';
import crypto from 'crypto';
import util from '../../../lib/util';
import config from '../../../config/config';

module.exports = (app) => {
  const _app = app;
  _app.controller.usuario = {};
  const usuarioController = _app.controller.usuario;
  const UsuarioModel = app.src.db.models.usuario;

  const PersonaModel = app.src.db.models.persona;
  const UsuarioRolModel = app.src.db.models.usuario_rol;
  const RolModel = app.src.db.models.rol;
  const PlantillaModel = app.src.db.models.plantilla;
  const DpaModel = app.src.db.models.dpa;
  const email = app.src.lib.email;

  const sequelize = app.src.db.sequelize;

  async function getUsuario(req, res) {
    if (!req.query.order) {
      req.query.order = 'id_usuario DESC';
    }
    const query = util.paginar(req.query);
    query.where = [
      { estado: { $ne: 'ELIMINADO' } },
    ];
    if (req.query.filter) {
      query.where.push({
        $or: [
          sequelize.literal(`"persona"."nombres" ILIKE '${req.query.filter}%'`),
          sequelize.literal(`"persona"."primer_apellido" ILIKE '${req.query.filter}%'`),
          sequelize.literal(`"usuario"."usuario" ILIKE '${req.query.filter}%'`),
        ],
      });
    }
    const queryRol = { estado: 'ACTIVO' };
    if (req.body.audit_usuario.id_rol !== 1) {
      queryRol.fid_rol = { $notIn: [1, 5] }; // ADMIN, SERVICIO_OVT
    }
    try {
      const dataUsuario = await UsuarioModel.buscarIncluye(PersonaModel, UsuarioRolModel, RolModel, DpaModel, query, queryRol);
      if (dataUsuario.count > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente',
          datos: {
            count: dataUsuario.count,
            rows: dataUsuario.rows,
          },
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron usuarios registrados.',
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
  usuarioController.get = getUsuario;

  async function getUsuarioId(req, res) {
    const idUsuario = req.params.id;
    const dataUsuario = await UsuarioModel.buscarIncluyeOne(idUsuario, PersonaModel, UsuarioRolModel, RolModel, DpaModel);
    if (dataUsuario) {
      const usuarioDevolver = JSON.parse(JSON.stringify(dataUsuario));
      res.status(200).json({
        finalizado: true,
        mensaje: 'Datos obtenidos correctamente.',
        datos: usuarioDevolver,
      });
    } else {
      res.status(204).json({
        finalizado: false,
        mensaje: 'No existe el usuario solicitado.',
        datos: {},
      });
    }
  }
  usuarioController.getId = getUsuarioId;

  usuarioController.post = async (req, res) => {
    const usuarioCrear = req.body;
    let usuarioDevolver = {};
    const configuracion = config();
    usuarioCrear._usuario_creacion = usuarioCrear.audit_usuario.id_usuario;

    try {
      const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
        const usuarioEncontrado = await UsuarioModel.findOne({ where: { email: usuarioCrear.email, estado: 'ACTIVO' } });
        if (usuarioEncontrado) {
          throw new Error(`Ya existe un usuario registrado con el correo electrónico proporcionado. Su estado es: ${usuarioEncontrado.estado}`);
        } else {
          if (usuarioCrear.roles === 3) { // rol municipio
            if (usuarioCrear.cod_municipio) {
              usuarioCrear.cod_municipio = usuarioCrear.cod_municipio;
            } else {
              throw new Error('Debe seleccionar un municipio.');
            }
          }
          usuarioCrear.estado = 'PENDIENTE';
          usuarioCrear.usuario = usuarioCrear.email;
          usuarioCrear.codigo_contrasena = Math.trunc(Math.random() * 99999999).toString();
          const fecha = new Date();
          usuarioCrear.fecha_expiracion = fecha.setDate(fecha.getDate() + 1);
          usuarioDevolver = await UsuarioModel.create(usuarioCrear);
          const rolesUsuariosCrear = [
            {
              fid_rol: usuarioCrear.roles,
              fid_usuario: usuarioDevolver.id_usuario,
              _usuario_creacion: req.body.audit_usuario.usuario,
            },
          ];
          await UsuarioRolModel.bulkCreate(rolesUsuariosCrear);
          const plantilla = await PlantillaModel.findOne({ where: { nombre: 'USUARIO_REGISTRO' } });
          const template = handlebars.compile(plantilla.contenido);
          const data = {
            nombre: usuarioDevolver.email,
            urlSistemaActivacion: `${configuracion.urlConfirmarCuenta}${usuarioCrear.codigo_contrasena}`,
            urlLogoMinisterio: configuracion.urlLogoMinisterio,
          };
          const correoEnviar = {
            remitente: plantilla.remitente,
            origen: plantilla.origen,
            modo: 'html',
            mensaje: template(data),
            correos: [usuarioCrear.email],
            asunto: plantilla.asunto,
          };
          util.enviar(correoEnviar);
        }
      });
      if (transaccion.finalizado) {
        return res.status(200).json({
          finalizado: true,
          mensaje: 'Creación de usuario exitoso.',
          datos: usuarioDevolver,
        });
      } else {
        throw new Error(transaccion.mensaje);
      }
    }
    catch (error) {
      return res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  usuarioController.put = async (req, res) => {

    const usuarioCrear = req.body;
    const idUsuario = req.params.id;
    usuarioCrear._usuario_creacion = usuarioCrear.audit_usuario.id_usuario;

    try {
      const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
        const usuarioObtener = await UsuarioModel.findOne({
          where: {
            id_usuario: idUsuario,
            //estado: 'ACTIVO',
          },
        });
        const rolUsuarios = await UsuarioRolModel.findOne({
          where: {
            fid_usuario: idUsuario,
          },
        });
        if (usuarioObtener) {
          if (req.body.roles === 3) {
            if (req.body.cod_municipio) {
              const usuarioActualizar = {
                cod_municipio: req.body.cod_municipio,
                email: req.body.email,
                usuario: req.body.email,
                _usuario_creacion: req.body.audit_usuario.id_usuario,
              };
              const rolActualizar = {
                fid_rol: req.body.roles,
              };
              await rolUsuarios.updateAttributes(rolActualizar);
              await usuarioObtener.updateAttributes(usuarioActualizar);
            } else {
              throw new Error('Debe seleccionar un municipio.');
            }
          } else {
            const usuarioActualizar = {
              rol: req.body.roles,
              email: req.body.email,
              usuario: req.body.email,
              _usuario_creacion: req.body.audit_usuario.id_usuario,
            };
            const rolActualizar = {
              fid_rol: req.body.roles,
            };
            await rolUsuarios.updateAttributes(rolActualizar);
            await usuarioObtener.updateAttributes(usuarioActualizar);
          }
          res.status(200).json({
            finalizado: true,
            mensaje: 'Actualización de datos exitoso.',
            datos: {},
          });
        } else {
          throw new Error('El usuario no se encuentra registrado en el sistema o no esta activo.');
        }
      });
      if (transaccion.finalizado) {
        return res.status(200).json({
          finalizado: true,
          mensaje: 'Creación de usuario exitoso.',
          datos: {},
        });
      } else {
        throw new Error(transaccion.mensaje);
      }
    }
    catch (error) {
      return res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  usuarioController.activar = async (req, res) => {
    const usuarioCrear = {};
    try {
      const usuarioObtener = await UsuarioModel.findOne({
        where: {
          usuario: req.body.usuario,
          codigo_contrasena: req.body.codigo_contrasena,
          fecha_expiracion: {
            $gt: new Date(),
          },
          estado: {
            $eq: 'PENDIENTE',
          },
        },
      });

      if (usuarioObtener) {
        usuarioCrear.contrasena = req.body.contrasena;
        usuarioCrear.estado = 'ACTIVO';
        usuarioCrear.codigo_contrasena = null;
        usuarioCrear.fecha_expiracion = null;
        await usuarioObtener.updateAttributes(usuarioCrear);

        return res.status(200).json({
          finalizado: true,
          mensaje: 'Creación de usuario exitoso.',
          datos: { usuario: req.body.usuario },
        });
      } else {
        throw new Error('Código incorrecto o ya expiró.');
      }
    }
    catch (error) {
      return res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  usuarioController.delete = async (req, res) => {
    const idUsuario = req.params.id;
    try {
      const usuarioObtener = await UsuarioModel.findOne({
        where: {
          id_usuario: idUsuario,
          estado: 'ACTIVO',
        },
      });
      if (usuarioObtener) {
        const usuarioActualizar = {
          estado: 'INACTIVO',
          _usuario_creacion: req.body.audit_usuario.id_usuario,
        };
        await usuarioObtener.updateAttributes(usuarioActualizar);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Eliminación de usuario exitoso.',
          datos: {},
        });
      } else {
        throw new Error('El usuario no se encuentra registrado en el sistema o no esta activo.');
      }
    }
    catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  usuarioController.reenviaCorreo = async (req, res) => {
    const idUsuario = req.params.id;
    const usuarioCrear = req.body;
    const configuracion = config();
    usuarioCrear._usuario_creacion = usuarioCrear.audit_usuario.id_usuario;

    try {
      const usuarioObtener = await UsuarioModel.findOne({
        where: {
          id_usuario: idUsuario,
          estado: 'PENDIENTE',
        },
      });
      if (usuarioObtener) {
        const fecha = new Date();
        const usuarioActualizar = {
          codigo_contrasena: Math.trunc(Math.random() * 99999999).toString(),
          fecha_expiracion: fecha.setDate(fecha.getDate() + 1),
          _usuario_creacion: req.body.audit_usuario.id_usuario,
        };
        await usuarioObtener.updateAttributes(usuarioActualizar);

        const plantilla = await PlantillaModel.findOne({ nombre: 'USUARIO_REGISTRO' });
        const template = handlebars.compile(plantilla.contenido);
        const data = {
          nombre: usuarioObtener.email,
          urlSistemaActivacion: `${configuracion.urlConfirmarCuenta}${usuarioActualizar.codigo_contrasena}`,
          urlLogoMinisterio: configuracion.urlLogoMinisterio,
        };
        const correoEnviar = {
          remitente: plantilla.remitente,
          origen: plantilla.origen,
          modo: 'html',
          mensaje: template(data),
          correos: [usuarioObtener.email],
          asunto: plantilla.asunto,
        };
        util.enviar(correoEnviar);

        res.status(200).json({
          finalizado: true,
          mensaje: 'Operación realizada correctamente.',
          datos: {},
        });
      } else {
        throw new Error('El usuario no se encuentra registrado en el sistema o la cuenta ya esta activada.');
      }
    }
    catch (error) {
      return res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  usuarioController.verificarCorreo = async (req, res) => {
    const configuracion = config();
    try {
      const usuarioObtener = await UsuarioModel.findOne({
        where: {
          email: req.body.email,
          estado: 'ACTIVO',
        },
      });
      if (!usuarioObtener) {
        throw new Error(`No se ha encontrado ningún usuario activo con el correo ${req.body.email}`);
      }
      const fecha = new Date();
      const datosUsuario = {
        codigo_contrasena: Math.trunc(Math.random() * 99999999).toString(),
        fecha_expiracion: fecha.setDate(fecha.getDate() + 1),
      };
      const usuarioActualizar = await UsuarioModel.update(datosUsuario, {
        where: {
          id_usuario: usuarioObtener.id_usuario,
        },
      });
      const plantilla = await PlantillaModel.findOne({ where: { nombre: 'RESTAURAR_CONTRASENA' } });
      const template = handlebars.compile(plantilla.contenido);
      const data = {
        nombre: usuarioObtener.email,
        codigo: datosUsuario.codigo_contrasena,
        urlLogoMinisterio: configuracion.urlLogoMinisterio,
      };
      const correoEnviar = {
        remitente: plantilla.remitente,
        origen: plantilla.origen,
        modo: 'html',
        mensaje: template(data),
        correos: [usuarioObtener.email],
        asunto: plantilla.asunto,
      };
      util.enviar(correoEnviar);
      res.status(200).json({
        finalizado: true,
        mensaje: 'Operación realizada correctamente.',
        datos: usuarioActualizar,
      });
      return;
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const verificarCodigoContrasena = async (req) => {
    try {
      const usuarioObtener = await UsuarioModel.findOne({
        where: {
          email: req.body.email,
          codigo_contrasena: req.body.codigo,
          estado: 'ACTIVO',
        },
      });
      if (!usuarioObtener) {
        throw new Error('El código ingresado no existe. Por favor, verifique sus datos.');
      }
      if (usuarioObtener.fecha_expiracion < new Date()) {
        throw new Error('El código ingresado ya expiró. Por favor, verifique sus datos.');
      }
      return usuarioObtener;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  usuarioController.modificarContrasena = async (req, res) => {
    try {
      const usuarioObtener = await verificarCodigoContrasena(req);
      await usuarioObtener.updateAttributes({
        fecha_expiracion: new Date(),
        contrasena: req.body.contrasena,
      });
      res.status(200).json({
        finalizado: true,
        mensaje: 'Modificación de datos realizada correctamente.',
        datos: {},
      });
      return;
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  usuarioController.cambiarContrasena = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    const oldPassword = req.body.contrasena;
    const newPassword = req.body.contrasena_nueva;
    const password = crypto.createHash('md5').update(oldPassword).digest('hex');
    try {
      const usuarioObtener = await UsuarioModel.findOne({
        where: {
          id_usuario: usuario,
          contrasena: password,
        },
      });
      if (usuarioObtener) {
        await usuarioObtener.updateAttributes({
          fecha_expiracion: new Date(),
          contrasena: newPassword,
        });
        res.status(200).json({
          finalizado: true,
          mensaje: 'Modificación de datos realizada correctamente.',
          datos: {},
        });
      } else {
        res.status(412).json({
          finalizado: false,
          mensaje: 'La contraseña actual no es la correcta',
          datos: {},
        });
      }
      return;
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };
};
