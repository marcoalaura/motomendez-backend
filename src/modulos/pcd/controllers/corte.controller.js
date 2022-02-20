/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
/* eslint radix: ["error", "as-needed"] */

import fs from 'fs-extra';
import moment from 'moment';

import logger from './../../../lib/logger';
import sigep from './../../../services/sigep/sigep';
import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;

  const corteAnual = async (req, res) => {
    const idUsuario = req.body.audit_usuario.id_usuario;
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'ANUAL', 1, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      logger.info('[corte.controller][corteAnual] %s %d', 'realizar corte_anual para ->', gestion);
      const resCorteAnual = await app.dao.corte.realizarCorteAnual(idUsuario, gestion);
      if (resCorteAnual[0].corte_anual === 'Ok') {
        logger.info('[corte.controller][corteAnual]', 'se realizo el corte anual con exito ->', resCorteAnual[0].corte_anual);
        const gestionActual = await app.dao.corte.obtenerMaximaGestion();
        logger.info('[corte.controller][corteAnual]', 'generar reporte para la gestion ->', gestionActual.max);
        const generaReporte = await app.controller.reporte.generarReporteAnualTotal(gestionActual.max);
        if (generaReporte) {
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, null, 'ANUAL', 1, true);
          await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'ANUAL', 1, 'FINALIZAR');

          logger.info('[corte.controller][corteAnual] %s %j', 'se genero el reporte anual con exito ->', generaReporte);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Corte realizado con éxito.',
            datos: {},
          });
        } else {
          throw new Error('Error al generar el reporte anual.');
        }
      } else {
        throw new Error(resCorteAnual[0].corte_anual);
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, null, 'ANUAL', 1, false);
      await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'ANUAL', 1, 'FALLAR');

      logger.error('[corte.controller][corteAnual]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const corteMensual = async (req, res) => {
    const mes = req.query.mes ? req.query.mes : moment().format('M'); // TODO: cambiar
    const idUsuario = req.body.audit_usuario.id_usuario; // TODO: cambiar
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 10, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const gestion = await app.dao.corte.obtenerMaximaGestion();
      logger.info('[corte.controller][corteMensual] %s %d %d', 'realizar corte mensual para ->', gestion.max, mes);
      const resCorteMensual = await app.dao.corte.realizarCorteMensual(idUsuario, gestion.max, mes);
      if (resCorteMensual[0].corte_mensual === 'Ok') {
        logger.info('[corte.controller][corteMensual]', 'se realizo el corte mensual con exito ->', resCorteMensual[0].corte_mensual);
        // generando reportes
        // TODO: se dividio en un api la generacion de reportes
        /*  const mes = await app.dao.corte.obtenerMaximoMesPorGestion(gestion.max);
        logger.info('[corte.controller][corteMensual]', 'generar reportes para ->', mes.max);
        const generaReportes = await app.controller.reporte.generarReportesMunicipio(gestion.max, mes.max);
        if (generaReportes) {
        logger.info('[corte.controller][corteMensual] %s %j', 'se genero los reportes mensuales con exito ->', generaReportes); */

        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, moment().format('YYYY'), mes, 'MENSUAL', 10, true);
        await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 10, 'FINALIZAR');
        res.status(200).json({
          finalizado: true,
          mensaje: 'Corte realizado con éxito.',
          datos: {},
        });
        // TODO: continuacion de generacion de reportes
        /*  } else {
          throw new Error('Error al generar reportes');
        } */
      } else {
        throw new Error(resCorteMensual[0].corte_mensual);
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, moment().format('YYYY'), mes, 'MENSUAL', 10, false);
      await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 10, 'FALLAR');
      logger.error('[corte.controller][corteMensual]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const generarReportesGestionMes = async (req, res) => {
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    // const idMes = req.query.mes;
    const mes = req.query.mes ? req.query.mes : moment().format('M');
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 12, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const generaReportes = await app.controller.reporte.generarReportesMunicipio(gestion, mes);
      if (generaReportes) {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 12, true);
        await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 12, 'FINALIZAR');

        logger.info('[corte.controller][generaReportesGestionMes] %s %j', 'se genero los reportes mensuales con exito ->', generaReportes);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Corte realizado con éxito.',
          datos: {},
        });
      } else {
        throw new Error('Error al generar reportes');
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 12, false);
      await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 12, 'FALLAR');

      logger.error('[corte.controller][generaReportesGestionMes]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const regenerarReportesMunicipio = async (req, res) => {
    const gestion = req.query.gestion;
    const mes = req.query.mes;
    const municipios = req.body.municipios;
    try {
      const generaReportes = await app.controller.reporte.regenerarReportesMunicipio(gestion, mes, municipios);
      if (generaReportes) {
        logger.info('[corte.controller][generaReportesGestionMes] %s %j', 'se genero los reportes mensuales con exito ->', generaReportes);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Corte realizado con éxito.',
          datos: {},
        });
      } else {
        throw new Error('Error al generar reportes');
      }
    } catch (error) {
      logger.error('[corte.controller][generaReportesGestionMes]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerObservadosGestionMes = async (req, res) => {
    try {
      const idRol = req.body.audit_usuario.id_rol;
      let observados;
      logger.info('[corte.controller][obtenerObservadosGestionMes]', 'obtener observados gestion ->', req.query.gestion);
      logger.info('[corte.controller][obtenerObservadosGestionMes]', 'obtener observados mes ->', req.query.mes);
      req.query.estado = 'GENERADO';
      if (idRol === 2 || idRol === 4) { // rol ministeriotrue
        req.query.cod_municipio = null;
        observados = await app.dao.corte.obtenerObservadosGestionMes(req.query);
        observados.rows.forEach((elemento) => {
          elemento.dataValues.observacionTraducida = util.traduccionObservacionCorte(elemento.observacion);
        });
      } else if (idRol === 3) { // rol municipio
        const usuario = await app.dao.autenticacion.buscarUsuario({
          id_usuario: req.body.audit_usuario.id_usuario,
        });
        if (usuario && usuario.cod_municipio) {
          req.query.cod_municipio = usuario.cod_municipio;
          observados = await app.dao.corte.obtenerObservadosGestionMes(req.query);
          observados.rows.forEach((elemento) => {
            elemento.dataValues.observacionTraducida = util.traduccionObservacionCorte(elemento.observacion);
          });
        } else {
          throw new Error('El usuario no esta asociado a un municipio.');
        }
      } else {
        throw new Error('El usuario no tiene acceso.');
      }
      if (observados.rows && observados.rows.length) {
        logger.info('[corte.controller][obtenerObservadosGestionMes]', 'cantidad de observados ->', observados.rows.length);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente.',
          datos: observados,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros',
          datos: {},
        });
      }
    } catch (error) {
      logger.error('[corte.controller][obtenerObservadosGestionMes]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  /**
  * registrarDatosAdicionales - Método para registrar datos adicionales
  * @param {object} beneficiario
  * @return {object} datosLog
  */
  const registrarDatosAdicionales = async (beneficiario) => {
    logger.info('[corte.controller][registrarDatosAdicionales] %s %d', 'preguntando por beneficiario -> ', beneficiario.cod_beneficiario);
    const datosLog = {
      _usuario_modificacion: 1,
      estado: 'OBSERVADO_ACT',
      observacion: '',
    };
    // se procede a consultar si ya se registro los datos adicionales
    const consultaDatosAdicionales = await sigep.consultarDatosAdicionales(beneficiario.cod_beneficiario);
    if (consultaDatosAdicionales && consultaDatosAdicionales.body) {
      const datosRespuesta = consultaDatosAdicionales.body;
      if (datosRespuesta.data && datosRespuesta.data.beneficiario) {
        logger.info('[corte.controller][registrarDatosAdicionales] %s %d', 'ya se registraron los datos id_ubigeo-> ', datosRespuesta.data.idUbigeo);
        // comparando si el idUbigeo y idEntidad de Pago son los mismos que los actuales
        if (parseInt(beneficiario.id_ubigeo) !== datosRespuesta.data.idUbigeo || parseInt(beneficiario.id_entidad_pago) !== datosRespuesta.data.idEntidadPago) {
          logger.info('[corte.controller][registrarDatosAdicionales]', 'los datos de id_ubigeo y id_entidad_pago son distintos');
          // si son distintos se procede a actualizar los nuevos datos
          const actualizaDatosAdicionales = await sigep.actualizarDatosAdicionales(beneficiario);
          if (actualizaDatosAdicionales && actualizaDatosAdicionales.body && actualizaDatosAdicionales.statusCode === 200) {
            logger.info('[corte.controller][registrarDatosAdicionales] %s %d', 'se actualizo los datos con exito en el sigep -> ', datosRespuesta.data.beneficiario);
            datosLog.estado = 'ACTUALIZADO_SIGEP';
          } else {
            datosLog.observacion = actualizaDatosAdicionales.body.data.causa || 'Error al actualizar datos adicionales del beneficiario.';
            logger.info('[corte.controller][registrarDatosAdicionales]', 'error actualizar datos adicionales -> ', datosLog.observacion);
          }
        } else {
          datosLog.estado = 'ACTUALIZADO_SIGEP';
        }
      } else {
        // si no existe el registro de datos adicionales del beneficiario se procede a registrarlo en el sigep
        logger.info('[corte.controller][registrarDatosAdicionales] %s %j', 'respuesta de sigep ->', datosRespuesta.body);
        const registraDatosAdicionales = await sigep.registrarDatosAdicionales(beneficiario);
        if (registraDatosAdicionales && registraDatosAdicionales.body && registraDatosAdicionales.statusCode === 200) {
          logger.info('[corte.controller][registrarDatosAdicionales] %s %d', 'se registro los datos con exito  en el sigep -> ', beneficiario.cod_beneficiario);
          datosLog.estado = 'ACTUALIZADO_SIGEP';
        } else {
          datosLog.observacion = registraDatosAdicionales.body.error || 'Error al registrar datos adicionales';
          logger.info('[corte.controller][registrarDatosAdicionales]', 'error registro datos adicionales-> ', datosLog.observacion);
        }
      }
    } else {
      datosLog.observacion = 'Error al consultar datos adicionales - Servicio SIGEP';
    }
    datosLog.observacion = datosLog.observacion.substr(0, 500);
    return datosLog;
  };

  const registrarDatosAdicionalesSigep = async (req, res) => {
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 7, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const estado = 'REGISTRADO_SIGEP';
      const datosSinEnviar = await app.dao.corte.obtenerNoEnviadosSigep2(estado);
      if (datosSinEnviar) {
        logger.info('[corte.controller][registrarDatosAdicionalesSigep] %s %d', 'total con estado REGISTRADO_SIGEP->', datosSinEnviar.count);
        // verificando el estado del servicio SIGEP
        const estadoServicioSigep = await sigep.estado();
        logger.info('[corte.controller][registrarDatosAdicionalesSigep]', 'estado servicio sigep ->', estadoServicioSigep.body.estado);
        if (estadoServicioSigep.statusCode === 200) {
          for (const beneficiario of datosSinEnviar.rows) {
            const registraDatosAdicionales = await registrarDatosAdicionales(beneficiario);
            if (registraDatosAdicionales) {
              logger.info('[corte.controller][registrarDatosAdicionalesSigep] %s %j', 'actualizando log con ->', registraDatosAdicionales);
              await app.dao.corte.actualizarRegistroLogSigep(beneficiario.numero_documento, beneficiario.fecha_nacimiento, registraDatosAdicionales);
            }
          }
          // Actualizamos los casos que tuvieron problemas en su validación
          await app.dao.corte.actualizarRegistroLogSigepObs(estado);
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 7, true);
          await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), null, 'ANUAL', 3, true);
          await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 7, 'FINALIZAR');
          res.status(200).json({
            finalizado: true,
            mensaje: 'Beneficiarios Registrados con exito.',
            datos: {},
          });
        } else {
          throw new Error('El servicio del SIGEP-MEFP no se encuentra activo.');
        }
      } else {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 7, true);
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), null, 'ANUAL', 3, true);
        await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 7, 'FINALIZAR');
        res.status(204).json({
          finalizado: false,
          mensaje: 'No se encotraron registros.',
          datos: {},
        });
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 7, false);
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), null, 'ANUAL', 3, false);
      await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 7, 'FALLAR');
      logger.error('[corte.controller][registrarDatosAdicionalesSigep]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };
  /**
  * registrarBeneficiario - Método para registrar un beneficiario individual
  * @param {object} beneficiario
  * @return {object} datosLog
  */
  const registrarBeneficiario = async (beneficiario) => {
    logger.info('[corte.controller][registrarBeneficiario]', 'preguntando por beneficiario ->', beneficiario.numero_documento);
    const datosLog = {
      _usuario_modificacion: 1,
      estado: 'OBSERVADO_REG',
      observacion: '',
    };
    // se ṕrocede a consultar si el beneficiario ya estaba registrado anteriormente
    const consultaBeneficiario = await sigep.consultaBeneficiario(beneficiario);
    if (consultaBeneficiario && consultaBeneficiario.body) {
      // verificando si el beneficiario ya existe
      if (consultaBeneficiario.body.data && consultaBeneficiario.body.data.beneficiario && consultaBeneficiario.statusCode === 200) {
        logger.info('[corte.controller][registrarBeneficiario]', 'el beneficiario ya estaba registrado ->', consultaBeneficiario.body.data.beneficiario);
        datosLog.estado = 'REGISTRADO_SIGEP';
        datosLog.cod_beneficiario = consultaBeneficiario.body.data.beneficiario;
      } else {
        logger.info('[corte.controller][registrarBeneficiario]', 'el beneficiario no estaba registrado, se procede a enviarlo sigep ->', beneficiario.numero_documento);
        const registraBeneficiario = await sigep.registrarBeneficiario(beneficiario);
        // registrando el beneficiario
        logger.info('[corte.controller][registrarBeneficiario] %s %j', 'el beneficiario no estaba registrado, se procede a enviarlo sigep ->', registraBeneficiario.body);
        if (registraBeneficiario && registraBeneficiario.statusCode === 200 && registraBeneficiario.body.data) {
          datosLog.estado = 'REGISTRADO_SIGEP';
          datosLog.cod_beneficiario = registraBeneficiario.body.data.beneficiario;
        } else {
          datosLog.observacion = registraBeneficiario.body.error || JSON.stringify(registraBeneficiario.body.data) || registraBeneficiario.body || 'Error al registrar un beneficiario en el sigep.';
        }
      }
    } else {
      datosLog.observacion = 'Error al consultar un beneficiario - Servicio SIGEP';
    }
    datosLog.observacion = datosLog.observacion.substr(0, 500);
    return datosLog;
  };

  const registrarBeneficiariosSigep = async (req, res) => {
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY'); // TODO: cambiar
    const idUsuario = req.body.audit_usuario.id_usuario; // TODO: cambiar
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 5, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      // No es necesario llamar registrarBeneficiariosSigep, porque la funcion de Registarr ya lo hace
      // logger.info('[corte.controller][registrarBeneficiariosSigep] %s %d', 'realizar armado para ->', gestion);
      // const resArmadoSigep = await app.dao.corte.realizarArmadoSigep(idUsuario, gestion);
      // if (resArmadoSigep[0].armado_sigep === 'Ok') {
      // logger.info('[corte.controller][registrarBeneficiariosSigep]', 'Se realizo el armado exitoso', resArmadoSigep[0].armado_sigep);
      // const estado = ['CREADO', 'OBSERVADO_REG'];
      const estado = 'CREADO';
      const datosSinEnviar = await app.dao.corte.obtenerNoEnviadosSigep(estado);
      if (datosSinEnviar) {
        logger.info('[corte.controller][registrarBeneficiariosSigep] %s %d', 'total en estado CREADO ->', datosSinEnviar.count);
        // verificando el estado del servicio SIGEP
        const estadoServicioSigep = await sigep.estado();
        logger.info('[corte.controller][registrarBeneficiariosSigep]', 'estado servicio sigep ->', estadoServicioSigep.body.estado);
        if (estadoServicioSigep.statusCode === 200) {
          for (const beneficiario of datosSinEnviar.rows) {
            const registraBeneficiario = await registrarBeneficiario(beneficiario);
            if (registraBeneficiario) {
              // se procede a actualizar la tabla de log_servicio_sigep
              logger.info('[corte.controller][registrarBeneficiariosSigep] %s %j', 'actualizando log con ->', registraBeneficiario);
              await app.dao.corte.actualizarRegistroLogSigep(beneficiario.numero_documento, beneficiario.fecha_nacimiento, registraBeneficiario);
            }
          }
          // Actualizamos los casos que tuvieron problemas en su validación
          await app.dao.corte.actualizarRegistroLogSigepObs(estado);
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, moment().format('M'), 'MENSUAL', 5, true);
          await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 5, 'FINALIZAR');
          res.status(200).json({
            finalizado: true,
            mensaje: 'Beneficiarios Registrados con exito.',
            datos: {},

          });
        } else {
          throw new Error('El servicio del SIGEP-MEFP no se encuentra activo.');
        }
      } else {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, moment().format('M'), 'MENSUAL', 5, true);
        await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 5, 'FINALIZAR');
        res.status(204).json({
          finalizado: false,
          mensaje: 'No se encontraron registros.',
          datos: {},
        });
      }
      // } else {
      //   throw new Error(resArmadoSigep[0].armado_sigep);
      // }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, moment().format('M'), 'MENSUAL', 5, false);
      await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 5, 'FALLAR');
      logger.error('[corte.controller][registrarBeneficiariosSigep]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  /**
  * registraBonoGestionMes - Método para registrar un bono por gestion y mes
  * @param {object} beneficiario
  */
  const registrarBonoGestionMes = async (beneficiario) => {
    const datosBono = {};
    logger.error('[corte.controller][registrarBonoGestionMes] %s %d', 'consultando bono de idPcd ->', beneficiario.id_pcd);

    const consultaBono = await sigep.consultarCodigoBono(beneficiario);
    if (consultaBono && consultaBono.body) {
      if (consultaBono.body.data && consultaBono.body.data.identificadorPagoBono && consultaBono.statusCode === 200) {
        logger.error('[corte.controller][registrarBonoGestionMes] %s %d', 'el bono ya estaba registrado ->', consultaBono.body.data.identificadorPagoBono);
        datosBono.id_bono = consultaBono.body.data.identificadorPagoBono;
        datosBono.estado = 'REGISTRADO_SIGEP';
      } else {
        logger.error('[corte.controller][registrarBonoGestionMes] %s %d', 'registrando bono de idPcd ->', beneficiario.id_pcd);
        const registraBono = await sigep.registrarBono(beneficiario);
        if (registraBono && registraBono.body) {
          // se debe actualizar el cod_bono en corte_mensual
          if (registraBono.body.data && registraBono.body.data.identificadorPagoBono) {
            logger.error('[corte.controller][registrarBonoGestionMes]', 'registro exitoso identificadorBono ->', registraBono.body.data.identificadorPagoBono);
            datosBono.id_bono = registraBono.body.data.identificadorPagoBono;
            datosBono.estado = 'REGISTRADO_SIGEP';
          } else {
            // datosBono.estado = 'OBSERVADO_SIGEP';
            datosBono.estado = 'GENERADO';
            // datosBono.observacion = registraBono.body || 'Error al registrar bono - Servicio SIGEP';
            datosBono.observacion = JSON.stringify(registraBono.body) || 'Error al registrar bono - Servicio SIGEP';
            datosBono.observacion = datosBono.observacion.substr(0, 500);
            logger.error('[corte.controller][registrarBonoGestionMes]', 'no se pudo registrar el bono ->', datosBono.observacion);
          }
        } else {
          logger.error('[corte.controller][registrarBonoGestionMes]', 'error SIGEP al registrar bono ->', beneficiario.id_pcd);
          datosBono.estado = 'OBSERVADO_SIGEP';
          datosBono.observacion = 'Error al registrar Bono - Servicio SIGEP';
        }
      }
    } else {
      datosBono.estado = 'OBSERVADO_SIGEP';
      datosBono.observacion = 'Error al registrar Bono - Servicio SIGEP';
    }
    return datosBono;
  };

  const registrarBonosBeneficiarios = async (req, res) => {
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    const mes = req.query.mes ? req.query.mes : moment().format('M');
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 11, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const estado = 'GENERADO';
      const obtieneDatosCorte = await app.dao.corte.obtenerDatosCorteMensual(gestion, mes, estado);
      logger.error('[corte.controller][registrarBonosBeneficiarios] %s %d', 'cantidad bonos ->', obtieneDatosCorte.length);
      if (obtieneDatosCorte) {
        const estadoServicioSigep = await sigep.estado();
        logger.info('[corte.controller][registrarBonosBeneficiarios]', 'estado servicio sigep ->', estadoServicioSigep.body.estado);
        if (estadoServicioSigep.statusCode === 200) {
          for (const beneficiario of obtieneDatosCorte) {
            const datosBeneficiarioCorte = {
              fid_pcd: beneficiario.id_pcd,
              fid_gestion: beneficiario.gestion,
              fid_mes: beneficiario.fid_mes,
            };
            const registraBono = await registrarBonoGestionMes(beneficiario);
            if (registraBono) {
              logger.error('[corte.controller][registrarBonosBeneficiarios] %s %j', 'actualizando corte_mensual con ->', registraBono);
              await app.dao.corte.actualizarCorteMensualPcd(registraBono, datosBeneficiarioCorte);
            }
          }
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 11, true);
          await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 11, 'FINALIZAR');

          res.status(200).json({
            finalizado: true,
            mensaje: 'Bonos Registrados con exito.',
            datos: {},
          });
        } else {
          throw new Error('El Servicio de MEGP-SIGEP se encuentra inactivo.');
        }
      } else {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 11, true);
        await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 11, 'FINALIZAR');

        res.status(204).json({
          finalizado: false,
          mensaje: 'No se encontraron registros.',
          datos: {},
        });
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 11, false);
      await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 11, 'FALLAR');

      logger.error('[corte.controller][registrarBonosBeneficiarios]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

    /**
    * actualizarBeneficiario - Método para actualizar un beneficiario individual
    * @param {object} beneficiario
    * @return {object} datosLog
    */
  const actualizarBeneficiario = async (beneficiario) => {
    logger.info('[corte.controller][actualizarBeneficiario]', 'preguntando por beneficiario ->', beneficiario.numero_documento);
    const datosLog = {
      _usuario_modificacion: 1,
      estado: 'OBSERVADO_REG',
      observacion: '',
    };
    const actualizaBeneficiario = await sigep.actualizarBeneficiario(beneficiario);
    // registrando el beneficiario
    logger.info('[corte.controller][actualizarBeneficiario] %s %j', 'se procede a enviarlo sigep ->', actualizaBeneficiario.body);
    if (actualizaBeneficiario && actualizaBeneficiario.statusCode === 200 && actualizaBeneficiario.body.data) {
      datosLog.estado = 'REGISTRADO_SIGEP';
      datosLog.cod_beneficiario = actualizaBeneficiario.body.data.beneficiario;
    } else {
      datosLog.observacion = actualizaBeneficiario.body.error || JSON.stringify(actualizaBeneficiario.body.data) || registrarBono.body || 'Error al registrar un beneficiario en el sigep.';
    }
    datosLog.observacion = datosLog.observacion.substr(0, 500);
    return datosLog;
  };

  const actualizarBeneficiariosSigep = async (req, res) => {
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 6, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const estado = 'CREADO';
      const datosSinEnviar = await app.dao.corte.obtenerNoEnviadosCodBeneficiario(estado);
      if (datosSinEnviar) {
        logger.info('[corte.controller][actualizarBeneficiariosSigep] %s %d', 'total en estado CREADO ->', datosSinEnviar.count);
        // verificando el estado del servicio SIGEP
        const estadoServicioSigep = await sigep.estado();
        logger.info('[corte.controller][actualizarBeneficiariosSigep]', 'estado servicio sigep ->', estadoServicioSigep.body.estado);
        if (estadoServicioSigep.statusCode === 200) {
          for (const beneficiario of datosSinEnviar.rows) {
            const registraBeneficiario = await actualizarBeneficiario(beneficiario);
            if (registraBeneficiario) {
              // se procede a actualizar la tabla de log_servicio_sigep
              logger.info('[corte.controller][actualizarBeneficiariosSigep] %s %j', 'actualizando log con ->', registraBeneficiario);
              await app.dao.corte.actualizarRegistroLogSigep(beneficiario.numero_documento, beneficiario.fecha_nacimiento, registraBeneficiario);
            }
          }
          // Actualizamos los casos que tuvieron problemas en su validación
          await app.dao.corte.actualizarRegistroLogSigepObs(estado);
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 6, true);
          await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 6, 'FINALIZAR');
          res.status(200).json({
            finalizado: true,
            mensaje: 'Beneficiarios actualizados con exito.',
            datos: {},
          });
        } else {
          throw new Error('El servicio del SIGEP-MEFP no se encuentra activo.');
        }
      } else {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 6, true);
        await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 6, 'FINALIZAR');
        res.status(204).json({
          finalizado: false,
          mensaje: 'No se encontraron registros.',
          datos: {},
        });
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 6, false);
      await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 6, 'FALLAR');
      logger.error('[corte.controller][actualizarBeneficiariosSigep]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const reporteLog = async (req, res) => {
    try {
      const query = await app.dao.corte.obtenerLog(req.query.consulta);
      res.status(200).json({
        finalizado: false,
        mensaje: 'ok',
        datos: query,
      });
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const regularizarArchivos = async (req, res) => {
    try {
      const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
        const parametros = {
          attributes: ['id_tutor', [app.src.db.sequelize.fn('substring', app.src.db.sequelize.col('documento_ruta'), 1, 27), 'tipo_doc']],
          //limit: 2,
        };
        const tutores = await app.dao.tutor.obtenerAllTutores(parametros);
        for (let index = 0; index < tutores.length; index++) {
          const item = tutores[index].dataValues;
          if (item) {
            if (item.tipo_doc === 'data:application/pdf;base64') {
              const tutorObj = await app.dao.tutor.obtenerTutor({ where: { id_tutor: item.id_tutor } });
              const buffer = new Buffer(tutorObj.documento_ruta, 'base64');
              const dirPath = `${_path}`;
              const dirFiles = `${dirPath}/files`;
              if (!fs.existsSync(dirFiles)) {
                fs.mkdirsSync(dirFiles);
              }
              const dir = `${dirFiles}/pcds/`;
              const dirPcd = `${dir}${tutorObj.fid_pcd}/`;
              if (!fs.existsSync(dirPcd)) {
                fs.mkdirsSync(dirPcd);
              }
              const dirTutoresPcd = `${dirPcd}tutores/`;
              if (!fs.existsSync(dirTutoresPcd)) {
                fs.mkdirsSync(dirTutoresPcd);
              }
              const fecha = moment().format('YYYYMMDDhhmmss');
              const nombreArchivo = `${tutorObj.fid_persona}_${fecha}.pdf`;
              fs.writeFileSync(`${dirTutoresPcd}${nombreArchivo}`, buffer);
              await app.dao.tutor.modificarDocumentoRuta(tutorObj.id_tutor, `${dirTutoresPcd}${nombreArchivo}`, req.body.audit_usuario.id_usuario);
            }
          }
        }
      });
      if (transaccion.finalizado) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Registro exitoso.',
          datos: {},
        });
      } else {
        throw new Error(transaccion.mensaje);
      }
    } catch (e) {
      res.status(412).json({
        finalizado: false,
        mensaje: e.message,
        datos: {},
      });
    }
  };

  /**
  * consultarPagoBono - Método para consultar si se pagó el bono.
  * @param {object} bono
  */
  const consultarPagoBono = async (bono) => {
    const datosBono = {};
    logger.error('[corte.controller][actualizarPagoBono] %s %d', 'consultando pago de idPcd ->', bono.fid_pcd);

    const consultaPago = await sigep.consultarPago(bono);
    if (consultaPago && consultaPago.body) {
      if (consultaPago.body.data && consultaPago.statusCode === 200) {
        if (consultaPago.body.data.estado === 'PAGADO') {
          logger.error('[corte.controller][actualizarPagoBono] %s %d', 'el bono ha sido pagado ->', consultaPago.body.data.id_bono);
          // datosBono.estado = 'PAGADO';
          datosBono.observacion_pago = 'PAGADO';
          datosBono.fecha_pago = moment(consultaPago.body.data.fechaPago, 'DD/MM/YYYY');
        } else {
          logger.error('[corte.controller][actualizarPagoBono] %s %d', 'el bono ha sido consultado ->', bono.id_bono);
          datosBono.observacion_pago = 'CONSULTADO';
        }
      } else {
        logger.error('[corte.controller][actualizarPagoBono] %s %d', 'Ha existido un ERROR con la consulta del bono ->', bono.id_bono);
        datosBono.observacion_pago = 'ERROR';
      }
    } else {
      datosBono.observacion_pago = 'ERROR';
    }
    return datosBono;
  };

  /**
  * actualizarPagosBonos - Método para actualizar el estado de los bonos pagados.
  *
  */
  const actualizarPagosBonos = async (req, res) => {
    let pivote = 0;
    try {
      const cantidad = req.query.cantidad;
      const gestion = req.query.gestion;
      const ultimoControl = await app.dao.corte.obtenerUltimaConsulta();
      pivote = ultimoControl[0].pivote;
      const obtieneGrupo = await app.dao.corte.obtenerGrupoCorteMensualParaConsulta(gestion, cantidad, pivote);
      logger.error('[corte.controller][actualizarPagosBonos] %s %d', 'cantidad bonos a consultar ->', obtieneGrupo.length);
      if (obtieneGrupo) {
        // Comprobamos que exista registros, sino se reinicia
        if (obtieneGrupo.length > 0) {
          const estadoServicioSigep = await sigep.estado();
          logger.info('[corte.controller][actualizarPagosBonos]', 'estado servicio sigep ->', estadoServicioSigep.body.estado);
          if (estadoServicioSigep.statusCode === 200) {
            for (const bono of obtieneGrupo) {
              const datosBonoConsulta = {
                id_bono: bono.id_bono,
              };
              const actualizaPagoBono = await consultarPagoBono(bono);
              if (actualizaPagoBono) {
                logger.error('[corte.controller][actualizarPagosBonos] %s %j', 'actualizando pagos con ->', actualizaPagoBono);
                await app.dao.corte.registrarPagado(actualizaPagoBono, datosBonoConsulta);
                pivote = bono.id_corte_mensual;
              } else {
                logger.error('[corte.controller][actualizarPagosBonos] %s %d', 'bono que no se pudo consultar ->', bono);
              }
            }
            await app.dao.corte.actualizarPivote(pivote);
            res.status(200).json({
              finalizado: true,
              mensaje: 'Pagos actualizados con éxito.',
              datos: {},
            });
          } else {
            throw new Error('El Servicio de MEGP-SIGEP se encuentra inactivo.');
          }
        } else {
          // reiniciamos el contador para que vuelva a encontrar registros
          await app.dao.corte.actualizarPivote(0);
          res.status(200).json({
            finalizado: true,
            mensaje: 'No se encontraron pagos, se iniciará nuevamente la variable para encontrar los registros.',
            datos: {},
          });
        }        
      } else {
        res.status(204).json({
          finalizado: false,
          mensaje: 'No se encontraron registros.',
          datos: {},
        });
      }
    } catch (error) {
      logger.error('[corte.controller][actualizarPagosBonos]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const registrarBonosBeneficiariosRegularizados = async (req, res) => {
    // const gestion = req.query.gestion; // TODO: validar el mes y año porque no se puede pagar retroactivamente de un año antes.
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    const estado = 'GENERADO';
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 9, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      // const fechaInicio = req.query.fecha_inicio; // TODO: cambiar
      // const fechaFin = req.query.fecha_fin; // TODO: cambiar
      // const obtieneDatosRegularizados = await app.dao.corte.obtenerDatosRegularizados(fechaInicio, fechaFin, estado);
      const obtieneDatosRegularizados = await app.dao.corte.obtenerDatosRegularizados(gestion, estado);
      logger.error('[corte.controller][registrarBonosBeneficiariosRegularizados] %s %d', 'cantidad bonos a regularizar ->', obtieneDatosRegularizados.length);
      if (obtieneDatosRegularizados) {
        const estadoServicioSigep = await sigep.estado();
        logger.info('[corte.controller][registrarBonosBeneficiariosRegularizados]', 'estado servicio sigep ->', estadoServicioSigep.body.estado);
        if (estadoServicioSigep.statusCode === 200) {
          for (const beneficiario of obtieneDatosRegularizados) {
            const datosBeneficiarioCorte = {
              fid_pcd: beneficiario.id_pcd,
              fid_gestion: beneficiario.gestion,
              fid_mes: beneficiario.fid_mes,
            };
            const registraBono = await registrarBonoGestionMes(beneficiario);
            if (registraBono) {
              logger.error('[corte.controller][registrarBonosBeneficiariosRegularizados] %s %j', 'actualizando corte_mensual con ->', registraBono);
              await app.dao.corte.actualizarCorteMensualPcd(registraBono, datosBeneficiarioCorte);
            }
          }
          // Cuando finaliza el proceso actualizamos el estado del control corte
          await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, moment().format('M'), 'MENSUAL', 9, true);
          await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 9, 'FINALIZAR');
          res.status(200).json({
            finalizado: true,
            mensaje: 'Bonos Registrados con exito.',
            datos: {},
          });
        } else {
          throw new Error('El Servicio de MEGP-SIGEP se encuentra inactivo.');
        }
      } else {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, moment().format('M'), 'MENSUAL', 9, true);
        await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 9, 'FINALIZAR');
        res.status(204).json({
          finalizado: false,
          mensaje: 'No se encontraron registros.',
          datos: {},
        });
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, moment().format('M'), 'MENSUAL', 9, false);
      await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 9, 'FALLAR');
      logger.error('[corte.controller][registrarBonosBeneficiarios]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const generarReportesGestionMesRegularizados = async (req, res) => {
    // const gestion = req.query.gestion; // TODO: validar el mes y año porque no se puede pagar retroactivamente de un año antes.
    const fechaInicio = req.query.fecha_inicio; // TODO: cambiar
    const fechaFin = req.query.fecha_fin; // TODO: cambiar
    try {
      const generaReportes = await app.controller.reporte.generarReportesMunicipioRegularizados(fechaInicio, fechaFin);
      if (generaReportes) {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 12, true);
        logger.info('[corte.controller][generaReportesGestionMesRegularizados] %s %j', 'se genero los reportes mensuales con exito ->', generaReportes);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Corte realizado con éxito.',
          datos: {},
        });
      } else {
        throw new Error('Error al generar reportes');
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 12, false);
      logger.error('[corte.controller][generaReportesGestionMesRegularizados]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const generarReportesGestionMesAcumulado = async (req, res) => {
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    const mes = req.query.mes ? req.query.mes : moment().format('M');
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 13, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const generaReportes = await app.controller.reporte.generarReportesMunicipioAcumulado(gestion, mes, req.body.audit_usuario.id_usuario);
      if (generaReportes) {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 13, true);
        await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 13, 'FINALIZAR');

        logger.info('[corte.controller][generarReportesGestionMesAcumulado] %s %j', 'se genero los reportes con exito ->', generaReportes);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Reportes acumulados generados con éxito.',
          datos: {},
        });
      } else {
        throw new Error('Error al generar reportes');
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(req.body.audit_usuario.id_usuario, gestion, mes, 'MENSUAL', 13, true);
      await app.controller.controlApi.actualizaPasoControlApi(req.body.audit_usuario.id_usuario, 'MENSUAL', 13, 'FALLAR');

      logger.error('[corte.controller][generarReportesGestionMesAcumulado]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const generarRetroactivos = async (req, res) => {
    const gestion = req.query.gestion ? req.query.gestion : moment().format('YYYY');
    const idUsuario = req.body.audit_usuario.id_usuario;
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 8, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      logger.info('[corte.controller][generarRetroactivos] %s %d %d', 'generar retroactivo para ->', gestion);
      const resCorteMensual = await app.dao.corte.generarRetroactivo(idUsuario, gestion);
      if (resCorteMensual[0].retroactivo === 'Ok') {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, moment().format('M'), 'MENSUAL', 8, true);
        await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 8, 'FINALIZAR');
        logger.info('[corte.controller][generarRetroactivos]', 'se realizo la generacion del retroactivo con exito ->', resCorteMensual[0].retroactivo);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Corte realizado con éxito.',
          datos: {},
        });
      } else {
        throw new Error(resCorteMensual[0].retroactivo);
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(idUsuario, gestion, moment().format('M'), 'MENSUAL', 8, false);
      await app.controller.controlApi.actualizaPasoControlApi(idUsuario, 'MENSUAL', 8, 'FALLAR');
      logger.error('[corte.controller][generarRetroactivos]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };
  _app.controller.corte = {
    corteAnual,
    corteMensual,
    obtenerObservadosGestionMes,
    registrarBeneficiariosSigep,
    registrarDatosAdicionalesSigep,
    registrarBonosBeneficiarios,
    generarReportesGestionMes,
    regenerarReportesMunicipio,
    actualizarBeneficiariosSigep,
    reporteLog,
    regularizarArchivos,
    actualizarPagosBonos,
    registrarBonosBeneficiariosRegularizados,
    generarReportesGestionMesRegularizados,
    generarRetroactivos,
    generarReportesGestionMesAcumulado,
  };
};
