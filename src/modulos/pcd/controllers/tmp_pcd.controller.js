import logger from '../../../lib/logger';
import moment from 'moment';
import segip from '../../../services/segip/segip';
import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;

  const contrastarGeneral = async (personaDB, usuario) => {
    let persona = null;

    const datosPersona = {
      NumeroDocumento: personaDB.documento_identidad,
      FechaNacimiento: moment(personaDB.fecha_nacimiento).format('DD/MM/YYYY'),
      Nombres: personaDB.nombres,
      PrimerApellido: personaDB.primer_apellido ? personaDB.primer_apellido : '--',
      SegundoApellido: personaDB.segundo_apellido ? personaDB.segundo_apellido : '--',
      Complemento: personaDB.complemento ? personaDB.complemento : '',
    };

    const verificaSegip = await segip.contrastacion(datosPersona);
    if (verificaSegip) {
      if (verificaSegip.finalizado) {
        persona = { estado_contrastacion: 'HABILITADO',
          _usuario_modificacion: usuario };
      } else {
        // Comprobamos que cuando el tipo de error sea 500 o 429, vuelva a intentarlo consultar
        if (verificaSegip.datos.startsWith('500') || verificaSegip.datos.startsWith('429')) {
          persona = { estado_contrastacion: 'PENDIENTE',
          observacion_contrastacion: verificaSegip.datos.substring(0, 500),
          _usuario_modificacion: usuario };
        } else {
          persona = { estado_contrastacion: 'OBSERVADO',
          observacion_contrastacion: verificaSegip.datos.substring(0, 500),
          _usuario_modificacion: usuario };
        }
      }
    }
    return persona;
  };

  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  const contrastarTmpPcd = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 3, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const tmpCorteAnual = await app.dao.tmp_pcd.contrastarHabilitados(usuario);
      if (tmpCorteAnual[0].contrastar === 'Ok') {
        logger.info('[pcd.controller][contrastar]', 'mensaje ->', tmpCorteAnual);
        const pendientes = await app.dao.tmp_pcd.obtenerPendienteContrastacion();
        if (pendientes && pendientes.count > 0) {
          for (let i = 0; i < pendientes.count; i++) {
            const respuesta = await contrastarGeneral(pendientes.rows[i].dataValues, usuario);
            await wait(1000);

            if (respuesta) {
              // await app.dao.tmp_pcd.actualizar(pendientes.rows[i].dataValues.documento_identidad, pendientes.rows[i].dataValues.fecha_nacimiento, respuesta);
              await app.dao.tmp_pcd.actualizar(pendientes.rows[i].dataValues.id, respuesta);
              await app.dao.tmp_pcd.crearTmpPcdLog({ datos: pendientes.rows[i].dataValues, _usuario_creacion: usuario, tipo_caso: 'TMPPCD' });
            }
          }
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 3, true);
          await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 3, 'FINALIZAR');
          res.status(200).json({
            finalizado: true,
            mensaje: 'Contrastación realizado con éxito',
            datos: {},
          });
        } else {
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 3, true);
          await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 3, 'FINALIZAR');
          res.status(200).json({
            finalizado: true,
            mensaje: 'No existen registros a contrastar.',
            datos: {},
          });
        }
      } else {
        throw new Error(tmpCorteAnual[0].contrastar);
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 3, false);
      await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 3, 'FALLAR');
      logger.error('[pcd.controller][contrastar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const cargar = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    let finalizado = false;
    let mensaje = '';
    try {
        const cargaTmpPcd = await app.dao.tmp_pcd.cargarTmpPcd(usuario);
        logger.info('[tmp_pcd.controller][cargar]', 'mensaje ->', cargaTmpPcd);
        if (cargaTmpPcd.length > 0) {
          if (cargaTmpPcd[0].carga === 'Ok') {
            finalizado = true;
            mensaje = 'Ok';
          } else {
            mensaje = cargaTmpPcd[0].carga;
          }
        } else {
          mensaje = cargaTmpPcd;
        }
        return res.status(200).json({
          finalizado,
          mensaje,
          datos: {},
        });
    } catch (error) {
      logger.error('[tmp_pcd.controller][cargar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const registrar = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    let finalizado = false;
    let mensaje = '';
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 4, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const registroTmpPcd = await app.dao.tmp_pcd.registrarTmpPcd(usuario);
      logger.info('[tmp_pcd.controller][registrar]', 'mensaje ->', registroTmpPcd);
      if (registroTmpPcd.length > 0) {
        if (registroTmpPcd[0].registro === 'Ok') {
          finalizado = true;
          mensaje = 'Ok';
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 4, true);
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), null, 'ANUAL', 2, true);
        } else {
          mensaje = registroTmpPcd[0].registro;
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 4, false);
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), null, 'ANUAL', 2, false);
        }
      } else {
        mensaje = registroTmpPcd;
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 4, false);
        await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), null, 'ANUAL', 2, false);
      }
      await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 4, 'FINALIZAR');
      return res.status(200).json({
        finalizado,
        mensaje,
        datos: {},
      });
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 4, false);
      await app.controller.controlCorte.actualizaPasoControlCorte(usuario, moment().format('YYYY'), null, 'ANUAL', 2, false);
      await app.controller.controlApi.actualizaPasoControlApi(usuario, 'MENSUAL', 4, 'FALLAR');
      logger.error('[tmp_pcd.controller][registrar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listar = async (req, res) => {
    const tipoParam = req.query.tipo;
    const estadoParam = req.query.estado;
    const usuario = req.body.audit_usuario;
    try {
      logger.info('[tmp_pcd.controller][listar]', 'idRol ->', usuario.id_rol);

      if ([2, 6, 7].includes(usuario.id_rol)) { // MINISTERIO, SIPRUN, IBC
        const query = { };
        if (usuario.id_rol === 2) {
          if (tipoParam) {
            query.tipo = tipoParam;
          }
        } else {
          query.tipo = (usuario.id_rol === 6) ? 'SIPRUNPCD' : 'IBC';
        }
        if (estadoParam) {
          query.estado_contrastacion = estadoParam;
        }

        const datos = await app.dao.tmp_pcd.listar(query, req.query);
        if (datos.count > 0) {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Obtencion de dato exitoso.',
            datos: {
              count: datos.count,
              rows: datos.rows
            }
          });
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No se encontraron registros para la solicitud.',
            datos: {}
          });
        }
      } else {
        throw new Error('El usuario no tiene autorización para acceder al recurso.');
      }
    } catch (error) {
      logger.error('[tmp_pcd.controller][listar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  const obtener = async (req, res) => {
    try {
      if (req.params.id) {
        const respuesta = await app.dao.tmp_pcd.obtenerRegistro({ id: req.params.id });
        if (respuesta) {
          res.status(200).json({
            finalizado: true,
            mensaje: 'Obtencion de dato exitoso.',
            datos: respuesta,
          });
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No se encontró resultado para la solicitud.',
            datos: {}
          });
        }
      } else {
        throw new Error('El parámetro id es requerido.');
      }
    } catch (error) {
      logger.error('[tmp_pcd.controller][obtenerRegistro] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  const modificar = async (req, res) => {
    const usuario = req.body.audit_usuario;
    try {
      if ([6, 7].includes(usuario.id_rol)) { // SIPRUN, IBC
        const where = {
          id: req.params.id,
          tipo: (usuario.id_rol === 6) ? 'SIPRUNPCD' : 'IBC',
          estado_contrastacion: 'OBSERVADO'
        };
        const pcd = await app.dao.tmp_pcd.obtenerRegistroCompleto(where);
        const datosPersona = {
          NumeroDocumento: pcd.documento_identidad,
          FechaNacimiento: moment(req.body.fecha_nacimiento).format('DD/MM/YYYY'),
          Nombres: req.body.nombres,
          PrimerApellido: req.body.primer_apellido ? req.body.primer_apellido : '--',
          SegundoApellido: req.body.segundo_apellido ? req.body.segundo_apellido : '--',
          Complemento: req.body.complemento ? req.body.complemento : '',
        };

        const whereDuplicado = {
          id: { $ne: req.params.id },
          tipo: (usuario.id_rol === 6) ? 'SIPRUNPCD' : 'IBC',
          documento_identidad: pcd.documento_identidad,
          fecha_nacimiento: req.body.fecha_nacimiento,
        };
        const pcdDuplicado = await app.dao.tmp_pcd.obtenerRegistro(whereDuplicado);

        if (pcd && !pcdDuplicado) {
          const verificaSegip = await segip.contrastacion(datosPersona);
          if (verificaSegip) {
            let persona = {
              nombres: req.body.nombres.toUpperCase(),
              primer_apellido: req.body.primer_apellido ? req.body.primer_apellido.toUpperCase() : null,
              segundo_apellido: req.body.segundo_apellido ? req.body.segundo_apellido.toUpperCase() : null,
              fecha_nacimiento: req.body.fecha_nacimiento,
              complemento: req.body.complemento ? req.body.complemento.toUpperCase() : null,
              casada_apellido: req.body.casada_apellido ? req.body.casada_apellido.toUpperCase() : null,
              estado_civil: req.body.estado_civil,
              formato_inf: req.body.formato_inf,
              expedido: req.body.expedido,
              telefono: req.body.telefono,
              direccion: req.body.direccion,
              estado_contrastacion: 'HABILITADO',
              observacion_contrastacion: null,
              // gestion_carga: moment().format('YYYY'),
              gestion_carga: Number(moment().format('D')) <= 20 ? moment().format('YYYY') : moment().add(1, 'month').format('YYYY'),
              mes_carga: Number(moment().format('D')) <= 20 ? moment().format('M') : moment().add(1, 'month').format('M'),
              _usuario_modificacion: usuario.id_usuario,
            };
            let mensaje = 'Datos personales actualizados exitosamente.';
            if (!verificaSegip.finalizado) {
              persona.estado_contrastacion = 'OBSERVADO';
              persona.observacion_contrastacion = verificaSegip.datos.substring(0, 500);
              mensaje = 'Datos personales actualizados exitosamente, pero no pudo contrastar con el SEGIP.';
            }
            await app.dao.tmp_pcd.actualizar(req.params.id, persona);
            await app.dao.tmp_pcd.crearTmpPcdLog({ datos: pcd, _usuario_creacion: usuario.id_usuario, tipo_caso: 'TMPPCD' });
            res.status(200).json({
              finalizado: true,
              mensaje,
              datos: {},
            });
          } else {
            throw new Error(`SEGIP: ${verificaSegip.mensaje}. <br>${verificaSegip.datos}`);
          }
        } else if (pcdDuplicado) {
          throw new Error('Existe un registro con el mismo carnet de identidad, fecha de nacimiento y tipo de registro.');
        } else {
          throw new Error('No existe el registro o no puede ser modificado.');
        }
      } else {
        throw new Error('El usuario no tiene autorizacción para acceder al recurso.');
      }
    } catch (error) {
      logger.error('[tmp_pcd.controller][modificar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };
  const verificar = async (req, res) => {
    try {
      if (req.params.ci !== '0') {
        // return await verificarConCI(req, res);
        const resultado = await consulta(req.params.ci, req.query.fecha_nacimiento, req.query.gestion);
        res.status(200).json(resultado);
      } else {
        await verificarSinCI(req, res);
      }
    } catch (error) {
      logger.error('[pcd.controller][verificar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };
  const modificarSecundario = async (req, res) => {
    const usuario = req.body.audit_usuario;
    try {
      if ([6, 7].includes(usuario.id_rol)) { // SIPRUN, IBC
        const where = {
          id: req.params.id,
          tipo: (usuario.id_rol === 6) ? 'SIPRUNPCD' : 'IBC',
        };
        const pcd = await app.dao.tmp_pcd.obtenerRegistroCompleto(where);

        if (pcd.estado_contrastacion === 'HABILITADO') {
          const whereDuplicado = {
            id: { $ne: req.params.id },
            tipo: (usuario.id_rol === 6) ? 'SIPRUNPCD' : 'IBC',
            documento_identidad: pcd.documento_identidad,
            fecha_nacimiento: req.body.fecha_nacimiento,
          };
          const pcdDuplicado = await app.dao.tmp_pcd.obtenerRegistro(whereDuplicado);
  
          if (pcd && !pcdDuplicado) {
            const persona = {
              casada_apellido: req.body.casada_apellido ? req.body.casada_apellido.toUpperCase() : null,
              estado_civil: req.body.estado_civil,
              formato_inf: req.body.formato_inf,
              expedido: req.body.expedido,
              telefono: req.body.telefono,
              direccion: req.body.direccion,
              _usuario_modificacion: usuario.id_usuario,
            };
            const mensaje = 'Datos secundarios actualizados exitosamente.';
  
            await app.dao.tmp_pcd.actualizar(req.params.id, persona);
            await app.dao.tmp_pcd.crearTmpPcdLog({ datos: pcd, _usuario_creacion: usuario.id_usuario, tipo_caso: 'TMPPCD' });
            res.status(200).json({
              finalizado: true,
              mensaje,
              datos: {},
            });
          } else if (pcdDuplicado) {
            throw new Error('Existe un registro con el mismo carnet de identidad, fecha de nacimiento y tipo de registro.');
          } else {
            throw new Error('No existe el registro o no puede ser modificado.');
          }
        } else {
          throw new Error('Solo se permite realizar la modificación para casos donde el registro se encuentra contrastado con el SEGIP.');
        }
      } else {
        throw new Error('El usuario no tiene autorizacción para acceder al recurso.');
      }
    } catch (error) {
      logger.error('[tmp_pcd.controller][modificar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };
  _app.controller.tmp_pcd = {
    contrastarTmpPcd,
    cargar,
    registrar,
    listar,
    obtener,
    modificar,
    verificar,
    modificarSecundario,
  };
};
