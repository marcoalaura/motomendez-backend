/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
import moment from 'moment';
import segip from './../../../services/segip/segip';
import siprunpcd from './../../../services/siprunpcd/siprunpcd';
import ibc from './../../../services/ibc/ibc';
import ovtParche from './../../../services/ovt-parche/ovt-parche';
import logger from './../../../lib/logger';
import util from './../../../lib/util';
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
  const _app = app;

  const status = async (req, res) => {
    res.status(200).json({
      finalizado: true,
      mensaje: 'El servicio de PEMM se encuentra disponible',
      datos: {},
    });
  };

  const listarPcd = async (req, res) => {
    try {
      const idRol = req.body.audit_usuario.id_rol;
      logger.info('[pcd.controller][listarPcd]', 'idRol ->', idRol);
      if (idRol <= 3) {
        if (idRol === 3) { // rol municipio
          logger.info('[pcd.controller][listarPcd]', 'id_usuario ->', req.body.audit_usuario.id_usuario);
          const usuario = await app.dao.autenticacion.buscarUsuario({ id_usuario: req.body.audit_usuario.id_usuario });
          if (usuario && usuario.cod_municipio) {
            req.query.codigo_municipio = usuario.cod_municipio;
          } else {
            throw new Error('El usuario no esta asociado a un municipio.');
          }
        }
        const pcd = await app.dao.pcd.listarPcd(req.query);
        if (pcd && pcd.rows && pcd.rows.length > 0) {
          logger.info('[pcd.controller][listarPcd]', 'pcd.rows.length ->', pcd.rows.length);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Obtencion de dato exitoso.',
            datos: {
              count: pcd.count,
              rows: pcd.rows,
            },
          });
        } else {
          res.status(204).json({
            finalizado: true,
            mensaje: 'No se encontraron registros para la solicitud.',
            datos: {},
          });
        }
      } else {
        throw new Error('El usuario no tiene acceso a esta información.');
      }
    } catch (error) {
      logger.error('[pcd.controller][listarPcd] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const mostrarDetallePcd = async (req, res) => {
    try {
      const ci = req.query.documento_identidad;
      logger.info('[pcd.controller][mostrarDetallePcd]', 'ci ->', ci);
      const datos = await app.dao.pcd.mostrarDetallePcd(ci);
      logger.info('[pcd.controller][mostrarDetallePcd] %s %j', 'datosPcd ->', datos);
      res.status(200).json({
        finalizado: true,
        mensaje: 'Exito',
        datos,
      });
    } catch (error) {
      logger.error('[pcd.controller][mostrarDetallePcd] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  /**
   * crearCertificados - Método para crear certificados en paralelo
   * @param {array} certificados
   * @param {number} usuarioAuditoria
   * @param {number} idPcd
   * @return {Promise}
   */
  const crearCertificados = (certificados, usuarioAuditoria, idPcd, tipo) => {
    return Promise.all(certificados.map(async (certificado) => {
      const datosCertificado = {
        tipo_certificado: tipo,
        fecha_vigencia: moment(certificado.fecha_vig, 'DD/MM/YYYY').format(),
        fecha_emision: moment(certificado.fecha_cer, 'DD/MM/YYYY').format(),
        numero_registro: certificado.id_certificado,
        tipo_discapacidad: certificado.tipo_disc,
        grado_discapacidad: certificado.grados_disc,
        porcentaje_discapacidad: certificado.porcentaje,
        _usuario_creacion: usuarioAuditoria,
        fid_pcd: idPcd,
        estado: 'ACTIVO',
      };
      logger.info('[pcd.controller][crearCertificados]', 'creando certificado con ->', datosCertificado.fecha_vigencia);
      const verificaCertificado = await app.dao.certificado.obtenerNroRegistro(moment(certificado.fecha_vig, 'DD/MM/YYYY').format(), idPcd, tipo);
      if (!verificaCertificado) {
        logger.info('[pcd.controller][crearCertificados]', 'ya existia un certificado con esa fecha de vigencia ->', datosCertificado.fecha_vigencia);
        await app.dao.pcd.crearCertificado(datosCertificado);
      }
    }));
  };

  const formatearCertificado = (certificado, tipo) => {
    return {
      tipo_certificado: tipo,
      fecha_vigencia: moment(certificado.fecha_vig, 'DD/MM/YYYY').format(),
      fecha_emision: moment(certificado.fecha_cer, 'DD/MM/YYYY').format(),
      numero_registro: certificado.id_certificado,
      tipo_discapacidad: certificado.tipo_disc,
      grado_discapacidad: certificado.grados_disc,
      porcentaje_discapacidad: certificado.porcentaje,
    };
  };

  /**
   * formatearDatosPersona - Método para obtener un objeto solo con los datos de persona
   * @param {object} datos
   * @return {object}
   */
  const formatearDatosPersona = (datos, usuarioAuditoria) => {
    return {
      documento_identidad: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[0] : datos.ci,
      complemento_documento: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[1] : null,
      expedido: datos.expedido || null,
      // fecha_nacimiento: datos.fecha_nacimiento || datos.fecha_nac,
      fecha_nacimiento: datos.fecha_nacimiento ? moment(datos.fecha_nacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment(datos.fecha_nac, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      nombres: datos.nombre_completo || datos.nombres,
      primer_apellido: datos.primer_apellido || datos.ap_paterno,
      segundo_apellido: datos.segundo_apellido || datos.ap_materno,
      casada_apellido: datos.apellido_casada || null,
      // formato_inf: datos.formato_inf || 'NUAC',
      formato_inf: datos.formato_inf || null,
      // nombre_completo_siprunpcd: `${datos.nombres} ${datos.ap_paterno} ${datos.ap_materno}`,
      sexo: datos.sexo ? datos.sexo.charAt(0) : null,
      // estado_civil: datos.estado_civil || null,
      estado_civil: datos.estado_civil_pcd || null,
      direccion: datos.direccion_pcd || null,
      telefono: datos.celular_pcd || null,
      // fid_tipo_documento: '100',
      tipo_documento: '100',
      // codigo_municipio: datos.id_municipio || '20101', // En caso de no tener municipio se le asigna a La Paz
      codigo_municipio: datos.id_municipio || null,
      _usuario_creacion: usuarioAuditoria,
    };
  };

  /**
   * formatearDatosPersonaIBC - Método para obtener un objeto solo con los datos de persona
   * @param {object} datos
   * @return {object}
   */
  const formatearDatosPersonaIBC = (datos, usuarioAuditoria) => {
    return {
      documento_identidad: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[0] : datos.ci,
      complemento_documento: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[1] : null,
      expedido: datos.expedido || null,
      // fecha_nacimiento: moment.parseZone(datos.fecha_nac).format('YYYY-MM-DD'),
      fecha_nacimiento: datos.fecha_nacimiento ? moment(datos.fecha_nacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment(datos.fecha_nac, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      nombres: datos.nombre_completo || datos.nombres,
      primer_apellido: datos.primer_apellido || datos.ap_paterno,
      segundo_apellido: datos.segundo_apellido || datos.ap_materno,
      casada_apellido: datos.apellido_casada || null,
      // formato_inf: datos.formato_inf || 'NUAC',
      formato_inf: datos.formato_inf || null,
      // nombre_completo_siprunpcd: `${datos.nombres} ${datos.ap_paterno} ${datos.ap_materno}`,
      sexo: datos.sexo ? datos.sexo.charAt(0) : null,
      estado_civil: datos.estado_civil || null,
      direccion: datos.direccion || null,
      telefono: datos.celular || null,
      // fid_tipo_documento: '100',
      tipo_documento: '100',
      // codigo_municipio: datos.id_municipio || '20101', // En caso de no tener municipio se le asigna a La Paz
      codigo_municipio: datos.id_municipio || null,
      _usuario_creacion: usuarioAuditoria,
    };
  };

     /**
   * formatearDatosPersonaSegip - Método para obtener un objeto solo con los datos de persona formateados
   * @param {object} datos
   * @return {object}
   */
  const formatearDatosPersonaSegip = (datos) => {
    return {
      NumeroDocumento: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[0] : datos.ci,
    //  Complemento: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[1] : null,
      FechaNacimiento: datos.fecha_nacimiento || datos.fecha_nac,
      Nombres: datos.nombre_completo || datos.nombres,
      PrimerApellido: datos.primer_apellido || datos.ap_paterno,
      SegundoApellido: datos.segundo_apellido || datos.ap_materno,
    };
  };

  const crearPcd = async (datosPcdSiprun, usuarioAuditoria, fechaPeticion) => {
    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
      // const usuarioAuditoria = datosPcdSiprun.body.audit_usuario.id_usuario;
      const datosPersonales = formatearDatosPersona(datosPcdSiprun, usuarioAuditoria);
      const datosInteroperabilidad = {
        documento_identidad: datosPersonales.documento_identidad,
        fecha_nacimiento: moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format(),
        // fecha_nacimiento: moment(datosPersonales.fecha_nacimiento).format('DD/MM/YYYY'),
        // fecha_nacimiento: datosPersonales.fecha_nacimiento,
      };
      const certificados = datosPcdSiprun.tcertificado;
      // 1ro verificar si esta registrado en nuestra base
      const verificaExistencia = await app.dao.persona.buscarPersona(datosInteroperabilidad);
      if (!verificaExistencia) {
        // si no esta registrado pasa a la validacion por segip
        // datosInteroperabilidad.complemento = datosPersonales.complemento_documento;
        // datosInteroperabilidad.fecha_nacimiento = moment(datosPersonales.fecha_nacimiento).format('DD/MM/YYYY');
        datosInteroperabilidad.fecha_nacimiento = datosPersonales.fecha_nacimiento;
        let verificarSegip = await app.dao.tmpSegip.verificarPersona(datosInteroperabilidad); // se esta verificando solo en una tabla temporal
        // const verificarSegip = await segip.verificarSegip(datosInteroperabilidad);
        // if (verificarSegip.finalizado) {
        if (verificarSegip) {
          // si existe en segip crea la persona
          verificarSegip = verificarSegip.get({
            plain: true,
          });
          datosPersonales.primer_apellido = verificarSegip.primer_apellido;
          datosPersonales.nombres = verificarSegip.nombres;
          datosPersonales.segundo_apellido = verificarSegip.segundo_apellido;
          datosPersonales.fecha_nacimiento = moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format();
          const creaPersona = await app.dao.persona.crearPersona(datosPersonales);
          if (creaPersona) {
            // busca el codigo_municipio
            const dpa = await app.dao.dpa.obtenerIdDpa(`0${datosPersonales.codigo_municipio.toString()}`);
            if (dpa) {
              const datosPcd = {
                estado: 'ACTIVO',
                fid_dpa: dpa.id_dpa,
                fid_persona: creaPersona.id_persona,
                _usuario_creacion: usuarioAuditoria,
              };
              const creaPcd = await app.dao.pcd.crearPcd(datosPcd);
              if (creaPcd) {
                await crearCertificados(certificados, usuarioAuditoria, creaPcd.id_pcd, 'SIPRUNPCD');
              }
            } else {
              throw new Error('Error en el codigo de municipio');
            }
          }
        } else {
          // throw new Error(verificarSegip.mensaje);
          const log = {
            observacion: 'No se encontro el registro',
            fecha_peticion: fechaPeticion,
            documento_identidad: datosPersonales.documento_identidad,
            fecha_nacimiento: datosPersonales.fecha_nacimiento,
            servicio: 'SIPRUN',
            _usuario_creacion: usuarioAuditoria,
          };
          await app.dao.pcd.crearLogServicio(log);
        //  throw new Error('No se encontro el registro');
        }
      } else {
        // obtener idPcd y crear los certificados
        const idPcd = await app.dao.pcd.obtenerIdPcdPorCi(datosPersonales.documento_identidad);
        if (idPcd) {
          await crearCertificados(certificados, usuarioAuditoria, idPcd.id_pcd, 'SIPRUNPCD');
        } else {
          throw new Error('No existe una Persona con Discapacidad con ese CI.');
        }
      }
    });
    return transaccion;
  };

  const formatearDatosPersonaCorteAnual = (datos, usuarioAuditoria) => {
    const data = {
      documento_identidad: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[0] : datos.ci,
      complemento_documento: datos.ci.indexOf('-') > 0 ? datos.ci.split('-')[1] : null,
      expedido: datos.expedido,
      fecha_nacimiento: datos.fecha_nacimiento || datos.fecha_nac,
      nombres: datos.nombre_completo || datos.nombres,
      primer_apellido: datos.primer_apellido || datos.ap_paterno,
      segundo_apellido: datos.segundo_apellido || datos.ap_materno,
      casada_apellido: datos.apellido_casada || datos.ap_casada,
      formato_inf: datos.formato_inf || 'NUAC',
      nombre_completo_siprunpcd: `${datos.nombres} ${datos.ap_paterno} ${datos.ap_materno}`,
      sexo: datos.sexo ? datos.sexo.charAt(0) : null,
      estado_civil: datos.estado_civil,
      direccion: datos.direccion || null,
      telefono: datos.celular || null,
      fid_tipo_documento: '100',
      codigo_municipio: datos.id_municipio || '20101', // En caso de no tener municipio se le asigna a La Paz
      _usuario_creacion: usuarioAuditoria,
    };
    // Se cambio de codigos de municipios de acuerdo a los codigos sigep
    // if (datos.id_municipio === '71103') {
    //   data.codigo_municipio = '71105';
    // }
    // if (datos.id_municipio === '71104') {
    //   data.codigo_municipio = '71103';
    // }
    // if (datos.id_municipio === '71105') {
    //   data.codigo_municipio = '71104';
    // }
    return data;
  };


  const crearPersonaPcd = async (datosPersonales, certificados, fechaPeticion, fechaInicio, fechaFin, usuarioAuditoria) => {
    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
      const creaPersona = await app.dao.persona.crearPersona(datosPersonales);
      if (creaPersona) {
        // busca el codigo_municipio
        // logger.info('[pcd.controller][crearPcdSegipContrastacion] %s', 'creacion de persona exitoso, verificar si existe el cod_municipio ->', `0${datosPersonales.codigo_municipio.toString()}`);
        const dpa = await app.dao.dpa.obtenerIdDpa(`0${datosPersonales.codigo_municipio.toString()}`);
        if (dpa) {
          // logger.info('[pcd.controller][crearPcdSegipContrastacion] %s %j', 'cod_municipio si existe->', dpa);
          const datosPcd = {
            estado: 'ACTIVO',
            cod_municipio: dpa.cod_municipio,
            fid_persona: creaPersona.id_persona,
            _usuario_creacion: usuarioAuditoria,
          };
          const creaPcd = await app.dao.pcd.crearPcd(datosPcd);
          if (creaPcd) {
            // logger.info('[pcd.controller][crearPcdSegipContrastacion] %s', 'pcd creado con exito ->', creaPcd.id_pcd);
            const creaCertificados = await crearCertificados(certificados, usuarioAuditoria, creaPcd.id_pcd, 'SIPRUNPCD');
            if (creaCertificados) {
              // logger.info('[pcd.controller][crearPcdSegipContrastacion]', 'certificado de pcd creado con exito');
              const datosLog = {
                fecha_peticion: fechaPeticion,
                estado: 'REGISTRADO',
                documento_identidad: datosPersonales.documento_identidad,
                fecha_nacimiento: datosPersonales.fecha_nacimiento,
                fecha_inicio: moment(fechaInicio, 'DD/MM/YYYY').format(),
                fecha_fin: moment(fechaFin, 'DD/MM/YYYY').format(),
                observacion: 'PEMM - SEGIP - Sin Observación',
                _usuario_creacion: usuarioAuditoria,
              };
              // logger.info('[pcd.controller][crearPcdSegipContrastacion]', 'creando log servicio ->', datosLog.documento_identidad);
              await app.dao.pcd.crearLogServicio(datosLog);
            }
          }
        } else {
          throw new Error('Error en el codigo de municipio');
        }
      }
    });
    return transaccion;
  };

  const actualizarPersonaPcd = async (datosPersonales, certificados, fechaPeticion, fechaInicio, fechaFin, usuarioAuditoria, persona) => {
    // exist registro de persona
    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
      let creaPcd;
      const codMunicipio = `0${datosPersonales.codigo_municipio.toString()}`;
      const dpa = await app.dao.dpa.obtenerIdDpa(codMunicipio);
      if (dpa) {
        creaPcd = await app.dao.pcd.buscarPcd(persona.id_persona);
        if (!creaPcd) {
          const datosPcd = {
            estado: 'ACTIVO',
            cod_municipio: dpa.cod_municipio,
            fid_persona: persona.id_persona,
            _usuario_creacion: usuarioAuditoria
          };
          creaPcd = await app.dao.pcd.crearPcd(datosPcd);
          if (creaPcd) {
            // registrar en log_servicio_siprumpcd
            const datosLog = {
              fecha_peticion: fechaPeticion,
              estado: 'REGISTRADO',
              documento_identidad: datosPersonales.documento_identidad,
              fecha_nacimiento: datosPersonales.fecha_nacimiento,
              fecha_inicio: moment(fechaInicio, 'DD/MM/YYYY').format(),
              fecha_fin: moment(fechaFin, 'DD/MM/YYYY').format(),
              observacion: 'PEMM - SEGIP - Sin Observación',
              _usuario_creacion: usuarioAuditoria
            };
            await app.dao.pcd.crearLogServicio(datosLog);
          }
        }
        if (creaPcd) {
          // actualizar municipio
          if (creaPcd.cod_municipio !== codMunicipio) {
            const datosPcd = {
              cod_municipio: dpa.cod_municipio,
              _usuario_modificacion: usuarioAuditoria
            };
            await app.dao.pcd.actualizarMunicipioPcd(creaPcd.id_pcd, datosPcd);
          }

          // crear certificados
          await crearCertificados(certificados, usuarioAuditoria, creaPcd.id_pcd, 'SIPRUNPCD');

          if (parseInt(persona.expedido) !== parseInt(datosPersonales.expedido) || persona.casada_apellido !== datosPersonales.casada_apellido ||
              persona.estado_civil !== datosPersonales.estado_civil || persona.formato_inf !== datosPersonales.formato_inf) {
            const datos = {
              expedido: datosPersonales.expedido,
              casada_apellido: datosPersonales.casada_apellido,
              estado_civil: datosPersonales.estado_civil,
              formato_inf: datosPersonales.formato_inf,
              // direccion: datosPersonales.direccion,
              // telefono: datosPersonales.telefono
              _usuario_modificacion: usuarioAuditoria
            };

            // TODO: add historial persona
            await app.dao.persona.actualizarPersona(persona.id_persona, datos);
          }
        } else {
          return {
            finalizado: false,
            mensaje: 'No existe una Persona con Discapacidad con ese CI.'
          };
        }
      } else {
        throw new Error('Error en el codigo de municipio');
      }
    });
    return transaccion;
  };


  const crearLogServicioSiprunpcd = async (datosPersonales, mensajeSegip, fechaPeticion, fechaInicio, fechaFin, usuarioAuditoria) => {
    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
      const existeLog = await app.dao.pcd.buscarLogServicio(datosPersonales.documento_identidad);
      const datosLog = {
        fecha_peticion: fechaPeticion,
        estado: 'OBSERVADO',
        documento_identidad: datosPersonales.documento_identidad,
        fecha_inicio: moment(fechaInicio, 'DD/MM/YYYY').format(),
        fecha_fin: moment(fechaFin, 'DD/MM/YYYY').format(),
        fecha_nacimiento: moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format(),
        observacion: `PEMM - SEGIP - ${mensajeSegip}`,
      };
      if (existeLog) {
        logger.info('[pcd.controller][crearLogServicioSiprunpcd] %s %j', 'ya tenia una observacion anterior ->', existeLog);
        datosLog._usuario_modificacion = usuarioAuditoria;
        await app.dao.pcd.actualizarLogServicio(datosPersonales.documento_identidad, datosLog);
      } else {
        logger.info('[pcd.controller][crearLogServicioSiprunpcd]', 'creando la observacion ->', datosLog.documento_identidad);
        datosLog._usuario_creacion = usuarioAuditoria;
        await app.dao.pcd.crearLogServicio(datosLog);
      }
    });
    return transaccion;
  };

  /**
   * crearPcdSegipContrastacion - Método para realizar la contrastacion con segip de pcds
   * @param {object} datosPcdSiprun
   * @param {number} usuarioAuditoria
   * @param {string} fechaPeticion
   * @param {Date} fechaInicio
   * @param {Date} fechaFin
   */
  const crearPcdSegipContrastacion = async (datosPcdSiprun, usuarioAuditoria, fechaPeticion, fechaInicio, fechaFin) => {
    const datosPersonales = formatearDatosPersona(datosPcdSiprun, usuarioAuditoria);
    const datosInteroperabilidad = formatearDatosPersonaSegip(datosPcdSiprun);
    const datosPersona = {
      documento_identidad: datosPersonales.documento_identidad,
      fecha_nacimiento: moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format(),
    };
    if (datosPersonales.complemento_documento) {
      datosInteroperabilidad.Complemento = datosPersonales.complemento_documento;
    }
    logger.info('[pcd.controller][crearPcdSegipContrastacion] %s %j', 'datosInteroperabilidad ->', datosInteroperabilidad);
    const certificados = datosPcdSiprun.tcertificado;
    // 1ro verificar si esta registrado en nuestra base
    if (datosPersonales.documento_identidad !== '') {
      logger.info('[pcd.controller][crearPcdSegipContrastacion] %s %j', 'buscar persona con', datosPersona);
      const verificaExistencia = await app.dao.persona.buscarPersona(datosPersona);
      if (!verificaExistencia) {
        // TODO: eliminado para realizar el cargado de los registros
        /* datosPersonales.fecha_nacimiento = moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format();
        const creaPersona = await crearPersonaPcd(datosPersonales, certificados, fechaPeticion, fechaInicio, fechaFin, usuarioAuditoria);
        return creaPersona; */
      } else {
        // obtener idPcd y crear los certificados
        // logger.info('[pcd.controller][crearPcdSegipContrastacion]', 'ya existe la persona en la bd ->', verificaExistencia);
        const idPcd = await app.dao.pcd.obtenerIdPcdPorCi(datosPersonales.documento_identidad);
        if (idPcd) {
          // logger.info('[pcd.controller][crearPcdSegipContrastacion]', 'creando cerfificados para ->', idPcd.id_pcd);
          const certificado = await crearCertificados(certificados, usuarioAuditoria, idPcd.id_pcd, 'SIPRUNPCD');
          return certificado;
        } else {
          logger.info('[pcd.controller][crearPcdSegipContrastacion] %s %j', 'No existe una persona con ese ci', datosPersonales.documento_identidad);
          return {
            finalizado: false,
            mensaje: 'No existe una Persona con Discapacidad con ese CI.',
          };
        }
      }
    } else {
      logger.info('[pcd.controller][crearPcdSegipContrastacion]', 'registro sin ci');
      return {
        finalizado: false,
        mensaje: 'Es necesario incluir el numero de documento de identidad',
      };
    }
  };

  const crearPcdSegipContrastacionCorteAnual = async (datosPcdSiprun, usuarioAuditoria, fechaPeticion) => {
    const datosPersonales = formatearDatosPersonaCorteAnual(datosPcdSiprun, usuarioAuditoria);
    const datosPersona = {
      documento_identidad: datosPersonales.documento_identidad,
      fecha_nacimiento: moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format()
    };
    const certificados = datosPcdSiprun.tcertificado;
    if (datosPersonales.documento_identidad !== '') {
      logger.info('[pcd.controller][crearPcdSegipContrastacionCorteAnual] %s %j', 'buscar persona con', datosPersona);
      // verificar existencia persona por ci y fecha_nac
      const verificaExistencia = await app.dao.persona.buscarPersona(datosPersona);
      const fecha = moment();

      if (!verificaExistencia) {
        datosPersonales.fecha_nacimiento = moment(datosPersonales.fecha_nacimiento, 'DD/MM/YYYY').format();
        const creaPersona = await crearPersonaPcd(datosPersonales, certificados, fechaPeticion, fecha, fecha, usuarioAuditoria);
        return creaPersona;
      } else {
        const actualizaPersona = await actualizarPersonaPcd(datosPersonales, certificados, fechaPeticion, fecha, fecha, usuarioAuditoria, verificaExistencia);
        return actualizaPersona;
      }
    } else {
      logger.info('[pcd.controller][crearPcdSegipContrastacionCorteAnual]', 'registro sin ci');
      return {
        finalizado: false,
        mensaje: 'Es necesario incluir el numero de documento de identidad'
      };
    }
  };


  const crearPcdSegip = async (datosPcdIBC, usuarioAuditoria) => {
    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
      // const usuarioAuditoria = datosPcdIBC.body.audit_usuario.id_usuario;
      const datosPersona = {
        // documento_identidad: datosPcdIBC.cedula_identidad,
        documento_identidad: datosPcdIBC.nro_documento,
        fecha_nacimiento: moment(datosPcdIBC.fecha_nacimiento, 'DD/MM/YYYY').format(),
      };
      const certificados = datosPcdIBC.tcertificado;
      // 1ro verificar si esta registrado en nuestra base
      logger.info('[pcd.controller][crearPcdSegip] %s %j', 'verificando existencia de persona ->', datosPersona);
      const verificaExistencia = await app.dao.persona.buscarPersona(datosPersona);
      if (!verificaExistencia) {
        // si no esta registrado pasa a la validacion por segip
        datosPersona.nombres = datosPcdIBC.nombres;
        datosPersona.primer_apellido = datosPcdIBC.primer_apellido;
        datosPersona.segundo_apellido = datosPcdIBC.segundo_apellido;
        datosPersona.complemento_documento = datosPcdIBC.complemento;
        datosPersona._usuario_creacion = usuarioAuditoria;
        datosPersona.fid_tipo_documento = '100';
        const creaPersona = await app.dao.persona.crearPersona(datosPersona);
        if (creaPersona) {
          logger.info('[pcd.controller][crearPcdSegip] %s %j', 'persona creada con exito ->', creaPersona);
          // busca el codigo_municipio
          const dpa = await app.dao.dpa.obtenerIdDpa('020101');
          if (dpa) {
            const datosPcd = {
              estado: 'ACTIVO',
              cod_municipio: '020101', // TODO: verificar esto
              fid_dpa: dpa.id_dpa,
              fid_persona: creaPersona.id_persona,
              _usuario_creacion: usuarioAuditoria,
            };
            const creaPcd = await app.dao.pcd.crearPcd(datosPcd);
            if (creaPcd) {
              logger.info('[pcd.controller][crearPcdSegip] %s %j', 'creacion de pcd exitoso ->', creaPcd);
              await crearCertificados(certificados, usuarioAuditoria, creaPcd.id_pcd, 'IBC');
            }
          } else {
            throw new Error('Error en el codigo de municipio');
          }
        }
      } else {
        logger.info('[pcd.controller][crearPcdSegip] %s %j', 'ya existia la persona en la bd ->', datosPersona);
        // obtener idPcd y crear los certificados
        const idPcd = await app.dao.pcd.obtenerIdPcdPorCi(datosPersona.documento_identidad);
        if (idPcd) {
          logger.info('[pcd.controller][crearPcdSegip]', 'si existe el idpcd ->', idPcd.id_pcd);
          await crearCertificados(certificados, usuarioAuditoria, idPcd.id_pcd, 'IBC');
        } else {
          throw new Error('No existe una Persona con Discapacidad con ese CI.');
        }
      }
    });
    return transaccion;
  };

  const crearTmpPcd = async (datosPcd, tipo, estado, usuarioAuditoria) => {
    // Diferencias la forma de obtencion en el servicio SIPRUN e IBC
    let datosPersonales = null;
    if (tipo === 'IBC') {
      datosPersonales = formatearDatosPersonaIBC(datosPcd, usuarioAuditoria);
    } else {
      datosPersonales = formatearDatosPersona(datosPcd, usuarioAuditoria);
    }

    const datosPersona = {
      documento_identidad: datosPersonales.documento_identidad,
      fecha_nacimiento: datosPersonales.fecha_nacimiento,
      tipo,
    };
    if (datosPersonales.documento_identidad !== '' && datosPersonales.fecha_nacimiento !== '') {
      logger.info('[pcd.controller][crearTmpPcd] %s %j', 'buscar persona con', datosPersona);
      const certificado = formatearCertificado(datosPcd.tcertificado[0], tipo);
      const datos = Object.assign(datosPersonales, certificado);
      datos.gestion_carga = moment().format('YYYY');
      datos.mes_carga = moment().format('M');
      datos.tipo = tipo;
      datos.estado = estado;
      const fechaRegistro = moment(`20/${datos.mes_carga}/${datos.gestion_carga}`, 'DD/MM/YYYY').format();

      const tmpPcd = await app.dao.tmp_pcd.obtenerRegistroCompleto(datosPersona);
      if (tmpPcd) {
        delete datos.documento_identidad;
        delete datos.fecha_nacimiento;
        datos._usuario_modificacion = usuarioAuditoria;
        if (tipo === 'SIPRUNPCD' && tmpPcd.fecha_registro === null && certificado.porcentaje_discapacidad >= 50) {
          datos.fecha_registro = fechaRegistro;
        }
        // if (tmpPcd.estado_contrastacion === 'OBSERVADO') datos.estado_contrastacion = 'PENDIENTE';
        await app.dao.tmp_pcd.actualizar(tmpPcd.id, datos);
        await app.dao.tmp_pcd.crearTmpPcdLog({ datos: tmpPcd, _usuario_creacion: usuarioAuditoria, tipo_caso: 'TMPPCD' });
      } else {
        if (tipo === 'SIPRUNPCD') {
          datos.fecha_registro = certificado.porcentaje_discapacidad >= 50 ? fechaRegistro : null;
        }
        datos._usuario_creacion = usuarioAuditoria;
        await app.dao.tmp_pcd.crearRegistro(datos);
      }
      return { finalizado: true, mensaje: '' };
    } else {
      logger.info('[pcd.controller][crearTmpPcd]', 'registro sin ci');
      return { finalizado: false, mensaje: 'Es necesario incluir el numero de documento de identidad' };
    }
  };

  /**
   * crearPcdLote - Método para realizar el recorrido de todos los pcds retornados por SIPRUNPCD
   * @param {array} lote
   * @param {Date} fechaPeticion
   * @param {Date} fechaInicio
   * @param {Date} fechaFIn
   * @return {object}
   */
  const crearPcdLote = async (lote, fechaPeticion, usuarioAuditoria, fechaInicio, fechaFin) => {
    try {
      const errores = [];
      // --------- Recorrido secuencial -------------
      for (let pcd of lote.body.datos) {
        // const resultado = await crearPcdSegipContrastacion(pcd, usuarioAuditoria, fechaPeticion, fechaInicio, fechaFin);
        const resultado = await crearTmpPcd(pcd, 'SIPRUNPCD', 'ACTIVO', usuarioAuditoria);
      }
      // ------- Fin de Recorrido Secuencial ----------

      // ----------- Recorrido en Paralelo -------------
     /*  await Promise.all(lote.body.datos.map(async (pcd) => {
        const resultado = await crearPcdSegipContrastacion(pcd, usuarioAuditoria, fechaPeticion);
        if (!resultado.finalizado) {
          resultado.pcd = {
            ci: pcd.ci,
            fecha_nacimiento: pcd.fecha_nac,
          };
          errores.push(resultado);
        }
      })); */
      // -------------Fin de Recorrido en Paralelo ------------
      logger.info('[pcd.controller][crearPcdLote] %s %j', 'rechazados SIPRUNPCD ->', errores);
      return errores;
    } catch (error) {
      logger.error('[pcd.controller][crearPcdLote] %s %j', 'error ->', error.message);
      return error.message;
    }
  };

  const crearPcdXCI = async (lote, usuarioAuditoria, documentoIdentidad) => {
    try {
      const errores = [];
      let datos = null;
      // --------- Recorrido secuencial -------------
      for (let pcd of lote.body.datos) {
        if(documentoIdentidad === pcd.ci) {
          datos = pcd;
          const resultado = await crearTmpPcd(pcd, 'SIPRUNPCD', 'ACTIVO', usuarioAuditoria);  
        }
      }
      return datos;
    } catch (error) {
      logger.error('[pcd.controller][crearPcdLote] %s %j', 'error ->', error.message);
      return error.message;
    }
  };



  const crearPcdLoteCorteAnual = async (lote, fechaPeticion, usuarioAuditoria) => {
    try {
      for (let pcd of lote.body.datos) {
        await crearPcdSegipContrastacionCorteAnual(pcd, usuarioAuditoria, fechaPeticion);
      }
      return true;
    } catch (error) {
      logger.error('[pcd.controller][crearPcdLoteCorteAnual] %s %j', 'error ->', error.message);
      return error.message;
    }
  };


  /**
   * observarSiprunPCD - Método que lista los observados por SEGIP y envia a SIPRUNPCD
   * @param {date} fecha
   */
  const observarSiprunPCD = async (fecha, usuarioAuditoria) => {
    try {
      const observados = await app.dao.pcd.obtenerObservados(fecha);
      // logger.info('[pcd.controller][observarSiprunPCD]', 'cantidad de observados', 'observados ->', observados.rows.length);
      if (observados) {
       /*  await Promise.all(observados.rows.map(async (observado) => {
          const codigo = observado.estado === 'REGISTRADO' ? '1' : '0';
          const resultado = await siprunpcd.actualizarObservado(observado.documento_identidad, observado.observacion, codigo);
          if (resultado && resultado.body && resultado.body.finalizado) {
            const datosLog = {
              estado: 'ENVIADO',
              _usuario_modificacion: usuarioAuditoria,
            };
            await app.dao.pcd.actualizarLogServicio(observado.documento_identidad, datosLog);
          }
        })); */
        for (let observado of observados.rows) {
          const codigo = observado.estado === 'REGISTRADO' ? '1' : '0';
          logger.info('[pcd.controller][observarSiprunPCD]', 'observar a', 'ci ->', observado.documento_identidad);
          logger.info('[pcd.controller][observarSiprunPCD]', 'observacion', 'ci ->', observado.observacion);
          const resultado = await siprunpcd.actualizarObservado(observado.documento_identidad, observado.observacion, codigo);
          logger.info('[pcd.controller][observarSiprunPCD]', 'finalizado', 'siprunpcd ->', resultado.body.finalizado);
          if (resultado && resultado.body && resultado.body.finalizado) {
            const datosLog = {
              estado: 'ENVIADO',
              _usuario_modificacion: usuarioAuditoria,
            };
            await app.dao.pcd.actualizarLogServicio(observado.documento_identidad, datosLog);
          }
        }
        return true;
      }
      throw new Error('No se encontraron observados para esa fecha.');
    } catch (error) {
      logger.error('[pcd.controller][observarSiprunPCD] %s', 'error ->', error.message);
      return error;
    }
  };

  const obtenerDatosSiprun = async (req, res) => {
    const usuarioAuditoria = req.body.audit_usuario.id_usuario;
    try {
      // const fechaInicio = req.query.fecha_inicio;
      // const fechaFin = req.query.fecha_final;
      if (!await app.controller.controlApi.actualizaPasoControlApi(usuarioAuditoria, 'MENSUAL', 1, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      const { fechaInicio, fechaFin } = util.ragoFechas(req.query.fecha_inicio, req.query.fecha_final);
      logger.info('[pcd.controller][obtenerDatosSiprun]', 'fecha inicio', 'fechaInicio ->', fechaInicio);
      logger.info('[pcd.controller][obtenerDatosSiprun]', 'fecha fin', 'fechaFin ->', fechaFin);
      const datosSiprunpcd = await siprunpcd.obtenerListas(fechaInicio, fechaFin); // cargado de datos desde el servicio del SIPRUNPCD
      // const datosSiprunpcd = await app.controller.tmp_siprunpcd.obtenerDatosTmpSiprunPcd(fechaInicio, fechaFin); // cargado desde tabla temporal
      if (datosSiprunpcd && datosSiprunpcd.body && datosSiprunpcd.body.finalizado && datosSiprunpcd.body.datos) {
        if (datosSiprunpcd.body.datos && datosSiprunpcd.body.datos.length > 0) {
          const fechaPeticion = moment().format();
          logger.info('[pcd.controller][obtenerDatosSiprun]', 'fecha de peticion', 'fechaPeticion ->', fechaPeticion);
          const resultado = await crearPcdLote(datosSiprunpcd, fechaPeticion, usuarioAuditoria, fechaInicio, fechaFin);
          logger.info('[pcd.controller][obtenerDatosSiprun]', 'datosSiprunpcd --> ', datosSiprunpcd.body.datos.length);
          if (resultado) {
            const resObservados = await observarSiprunPCD(fechaPeticion, usuarioAuditoria);
            // const resObservados = 1;
            if (resObservados) {
              // Cuando finaliza el proceso actualizamos el estado del control corte
              await app.controller.controlCorte.actualizaPasoControlCorte(usuarioAuditoria, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 1, true);
              await app.controller.controlApi.actualizaPasoControlApi(usuarioAuditoria, 'MENSUAL', 1, 'FINALIZAR');
              await app.dao.tmp_pcd.crearTmpPcdLog({ datos: datosSiprunpcd.body.datos, _usuario_creacion: usuarioAuditoria, tipo_caso: 'SIPRUNPCD' });
              res.status(200).json({
                finalizado: true,
                mensaje: 'Creación/Actualización de registros exitoso.',
                datos: resultado,
              });
            }
          } else {
            throw new Error('Error al crear/actualizar las personas con discapacidad.');
          }
        } else {
          throw new Error('No se encontraron registros para ese rango de fechas.');
        }
      } else {
        throw new Error('Error al consultar el servicio del SIPRUNPCD.');
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(usuarioAuditoria, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 1, false);
      await app.controller.controlApi.actualizaPasoControlApi(usuarioAuditoria, 'MENSUAL', 1, 'FALLAR');
      logger.error('[pcd.controller][obtenerDatosSiprun] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerDatosSiprunCi = async (req, res) => {
    const usuarioAuditoria = req.body.audit_usuario.id_usuario;
    try {
      // const fecha = req.query.fecha_emision;
      const fecha = moment(req.query.fecha_emision).format('DD/MM/YYYY');
      const documentoIdentidad = req.query.documento_identidad;
      logger.info('[pcd.controller][obtenerDatosSiprun]', 'fecha ->', fecha);
      logger.info('[pcd.controller][obtenerDatosSiprun]', 'documento_identidad ->', documentoIdentidad);
      const datosSiprunpcd = await siprunpcd.obtenerListas(fecha, fecha); // cargado de datos desde el servicio del SIPRUNPCD
      // const datosSiprunpcd = await app.controller.tmp_siprunpcd.obtenerDatosTmpSiprunPcd(fechaInicio, fechaFin); // cargado desde tabla temporal
      if (datosSiprunpcd && datosSiprunpcd.body && datosSiprunpcd.body.finalizado && datosSiprunpcd.body.datos) {
        if (datosSiprunpcd.body.datos && datosSiprunpcd.body.datos.length > 0) {
          const fechaPeticion = moment().format();
          logger.info('[pcd.controller][obtenerDatosSiprun]', 'fecha de peticion', 'fechaPeticion ->', fechaPeticion);
          const resultado = await crearPcdXCI(datosSiprunpcd, usuarioAuditoria, documentoIdentidad);
          logger.info('[pcd.controller][obtenerDatosSiprun]', 'datosSiprunpcd --> ', datosSiprunpcd.body.datos.length);
          if (resultado) {
            await app.dao.tmp_pcd.crearTmpPcdLog({ datos: resultado, _usuario_creacion: usuarioAuditoria, tipo_caso: 'SIPRUNPCD' });
            res.status(200).json({
              finalizado: true,
              mensaje: 'Creación/Actualización de registros exitoso.',
              datos: resultado,
            });
          } else {
            throw new Error('No se encontro, el carnet de identidad en la fecha seleccionada.');
          }
        } else {
          throw new Error('No se encontraron registros para esa fecha.');
        }
      } else {
        throw new Error('Error al consultar el servicio del SIPRUNPCD.');
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(usuarioAuditoria, moment().format('YYYY'), moment().format('M'), 'MENSUAL', 1, false);
      logger.error('[pcd.controller][obtenerDatosSiprun] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };


  const obtenerCertificadoSiprun = async (cedula) => {
    logger.info('[pcd.controller][obtenerCertificadoSiprun]', 'cedula ->', cedula);
    const datosSiprunpcd = await siprunpcd.obtenerCertificado(cedula); // cargado de datos desde el servicio del SIPRUNPCD
    if (datosSiprunpcd && datosSiprunpcd.body && datosSiprunpcd.body.datos) {    
      const fechaPeticion = moment().format();
      logger.info('[pcd.controller][obtenerDatosSiprun]', 'fecha de peticion', 'fechaPeticion ->', fechaPeticion);
      return datosSiprunpcd.body.datos;
    } else {
      return {};
    }
  };

  const obtenerDatosIBC = async (req, res) => {
    const gestion = req.params.gestion ? req.params.gestion : moment().format('YYYY');
    const mes = req.params.mes ? req.params.mes : moment().format('M');
    const usuarioAuditoria = req.body.audit_usuario.id_usuario;
    try {
      if (!await app.controller.controlApi.actualizaPasoControlApi(usuarioAuditoria, 'MENSUAL', 2, 'INICIAR')) {
        return res.status(200).json({
          finalizado: false,
          mensaje: 'No se ha podido realizar el paso, debido a que otro proceso se ha ejecutado previamente.',
        });
      };
      // const datosIBC = await ibc.obtenerListas(gestion);
      const { fechaInicio, fechaFin } = util.ragoFechas(req.query.fecha_inicio, req.query.fecha_fin);
      const datosIBC = await ibc.obtenerListas(fechaInicio, fechaFin);
      if (datosIBC) {
        // logger.info('[pcd.controller][obtenerDatosIBC] %s %d', 'cantidad datos ibc ->', datosIBC.body.datos.count);
        const errores = [];
        const fechaCertificado = '01/01/' + gestion;
        const fechaVigencia = '31/12/' + gestion;
        if (datosIBC.body) {
          if (datosIBC.body.datos) {
            // --------- Recorrido secuencial -------------
            for (let pcd of datosIBC.body.datos.rows) {
              pcd.tcertificado = [{
                id_certificado: '0',
                // fecha_cer: '31/12/2016',
                fecha_cer: fechaCertificado,
                tipo_disc: 'CEGUERA',
                grados_disc: '',
                porcentaje: 33,
                // fecha_vig: '31/12/2018',
                fecha_vig: fechaVigencia,
              }];
              // pcd.ci = pcd.complemento ? `${pcd.cedula_identidad}-${pcd.complemento}` : pcd.cedula_identidad;
              const estado = pcd.estado === 'A' ? 'ACTIVO' : 'INACTIVO';
              pcd.ci = pcd.complemento ? `${pcd.nro_documento}-${pcd.complemento}` : pcd.nro_documento;
              // const resultado = await crearPcdSegip(pcd, usuarioAuditoria);
              const resultado = await crearTmpPcd(pcd, 'IBC', estado, usuarioAuditoria);
              if (!resultado) {
                resultado.pcd = {
                  ci: pcd.ci,
                  fecha_nacimiento: pcd.fecha_nac,
                };
                errores.push(resultado);
              }
            }
          }
        }
        
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(usuarioAuditoria, gestion, mes, 'MENSUAL', 2, true);
        await app.controller.controlApi.actualizaPasoControlApi(usuarioAuditoria, 'MENSUAL', 2, 'FINALIZAR');
        logger.info('[pcd.controller][crearPcdBeneficio] %s %j', 'rechazados IBC ->', errores);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Creación/Actualización de registros exitoso.',
          datos: errores,
        });
        // ------- Fin de Recorrido Secuencial ----------
        // ----------- Recorrido en Paralelo -------------
      /*   await Promise.all(datosIBC.body.datos.rows.map(async (pcd) => {
          const _pcd = pcd;
          _pcd.certificado = [{
            id_certificado: '0',
            fecha_cer: '2017-01-01T04:00:00.000Z',
            tipo_disc: 'CEGUERA',
            grados_disc: '',
            porcentaje: 0,
            fecha_vig: '2018-12-01T04:00:00.000Z',
          }];
          const resultado = await crearPcdSegip(_pcd, usuarioAuditoria);
          if (!resultado.finalizado) {
            resultado.pcd = {
              ci: pcd.ci,
              fecha_nacimiento: pcd.fecha_nac,
            };
            errores.push(resultado);
          }
        })); */
      } else {
        throw new Error('Error al recuperar los datos del IBC');
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(usuarioAuditoria, gestion, mes, 'MENSUAL', 2, false);
      await app.controller.controlApi.actualizaPasoControlApi(usuarioAuditoria, 'MENSUAL', 2, 'FALLAR');
      logger.error('[pcd.controller][obtenerDatosIBC]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const crearPcdBeneficio = async (datosBeneficio, idBeneficio, usuarioAuditoria) => {
    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
      const datosPersona = {
        documento_identidad: datosBeneficio.documento_identidad,
        fecha_nacimiento: moment(datosBeneficio.fecha_nacimiento, 'DD/MM/YYYY').format(),
        fid_tipo_documento: (datosBeneficio.tipo_documento_identidad === 'CI') ? 100 : 105,
      };
      logger.info('[pcd.controller][crearPcdBeneficio] %s %j', 'buscando persona ->', datosPersona);
      const persona = await app.dao.persona.buscarPersona(datosPersona);
      if (persona) {
        logger.info('[pcd.controller][crearPcdBeneficio] %s %d', 'respuesta buscando persona ->', persona.id_persona);
        const pcd = await app.dao.pcd.buscarPcd(persona.id_persona);
        if (pcd) {
          logger.info('[pcd.controller][crearPcdBeneficio] %s %d', 'respuesta buscando pcd ->', pcd.id_pcd);
          const datosPcdBeneficio = {
            fid_pcd: pcd.id_pcd,
            fid_beneficio: idBeneficio,
            nit: datosBeneficio.nit,
            estado: 'ACTIVO',
          };
          // datosPcdBeneficio.fecha_inicio = moment(datosBeneficio.fecha_inicio, 'DD/MM/YYYY').format();
          const pcdBeneficio = await app.dao.pcd_beneficio.buscarPcdBeneficio(datosPcdBeneficio);
          datosPcdBeneficio.descripcion = datosBeneficio.tipo;
          datosPcdBeneficio.observacion = datosBeneficio.observacion;
          if (pcdBeneficio) {
            // NO deberia haber actualizaciones
            datosPcdBeneficio._usuario_modificacion = usuarioAuditoria;
            throw new Error('Ya se registro el beneficio anteriormente.');
          } else {
            logger.info('[pcd.controller][crearPcdBeneficio] %s %s', 'creando beneficio ->', datosPcdBeneficio.descripcion);
            datosPcdBeneficio._usuario_creacion = usuarioAuditoria;
            datosPcdBeneficio.fecha_inicio = new Date();
            await app.dao.pcd_beneficio.crearPcdBeneficio(datosPcdBeneficio);
          }
        } else {
          throw new Error('No se encontro a la Persona con Discapacidad.');
        }
      } else {
        // TODO: Es necesario crear la Persona?
        throw new Error('No se encontro la persona.');
      }
    });
    return transaccion;
  };

  const obtenerDatosOvt = async (req, res) => {
    try {
      const datosOVT = await ovtParche.obtenerListasPersonal('2017-11-13'); // fecha de ultimo registro en parche OVT
      if (datosOVT && datosOVT.body && datosOVT.body.datos) {
        logger.info('[pcd.controller][obtenerDatosOvt] %s %d', 'datosOVT ->', datosOVT.body.datos.rows.length);
        const usuarioAuditoria = req.body.audit_usuario.id_rol;
        const errores = [];
        // const rolBeneficio = req.body.audit_usuario.id_rol;
        const rolBeneficio = {
          id_rol: 5, // ROL DEL SERVICIO OVT
        };
        const idBeneficio = await app.dao.pcd_beneficio.buscarBeneficio(rolBeneficio);
        logger.info('[pcd.controller][obtenerDatosOvt] %s %d', 'idBeneficio ->', idBeneficio);
        if (idBeneficio) {
          for (let pcd of datosOVT.body.datos.rows) {
            const resultado = await crearPcdBeneficio(pcd, idBeneficio.id_beneficio, usuarioAuditoria);
            logger.info('[pcd.controller][obtenerDatosOvt] %s %s', 'crearBeneficio ->', resultado.finalizado);
            if (!resultado.finalizado) {
              resultado.pcd = {
                ci: pcd.documento_identidad,
                fecha_nacimiento: pcd.fecha_nacimiento,
              };
              errores.push(resultado);
            }
          }
         // logger.info('[pcd.controller][obtenerDatosOvt] %s %j', 'rechazados OVT -> ', errores);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Creación/Actualización de registros exitoso.',
            datos: errores,
          });
        } else {
          throw new Error('No existe el rolBeneficio');
        }
      } else {
        throw new Error('Error al recuperar datos del OVT.');
      }
    } catch (error) {
      logger.error('[pcd.controller][obtenerDatosOvt] %s', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const verificarConCI = async (req, res) => {
    try {
      // TODO si es diciembre considerarlo para el siguiente año, osea mostrar de diciembre a noviembre
      // Obtener la gestion considerando el corte al 20 de enero
      let gestion;
      if (moment().format('MM-DD') >= '01-24') {
        gestion = moment().format('YYYY');
      } else {
        gestion = moment().format('YYYY') - 1;
      }
      const ciCompleto = req.params.ci;
      const fechaNacimiento = moment(req.query.fecha_nacimiento, 'DD/MM/YYYY').format();
      const conComplemento = ciCompleto.split('-');
      const ci = conComplemento[0];
      logger.info('[pcd.controller][verificar]', 'ci ->', ci);
      logger.info('[pcd.controller][verificar]', 'fecha_nacimiento ->', fechaNacimiento);
      let datosPcd;
      if (conComplemento.length > 1) {
        datosPcd = await app.dao.pcd.obtenerPcdComplemento(conComplemento[0], conComplemento[1], fechaNacimiento);
      } else {
        datosPcd = await app.dao.pcd.obtenerPcd(ci, fechaNacimiento);
      }
      if (datosPcd) { // Existen datos en pcd
        logger.info('[pcd.controller][verificar]', 'resDatosPcd ->', datosPcd.persona.documento_identidad);
        // Buscar en log_servicio_sigep
        const parametros = {
          where: {
            fid_pcd: datosPcd.id_pcd,
          },
        };
        const dataLogSigep = await app.src.db.models.log_servicio_sigep.findOne(parametros);
        if (dataLogSigep && dataLogSigep.estado !== 'OBSERVADO_REG') {
          const parametrosCorte = {
            attributes: ['observacion', 'estado', 'fid_gestion', 'fid_mes'],
            where: {
              fid_pcd: datosPcd.id_pcd,
              fid_gestion: gestion
            },
            include: [{
              model: app.src.db.models.mes, as: 'corte_mensual_mes',
            }],
          };
          const dataCorte = await app.src.db.models.corte_mensual.findAll(parametrosCorte);
          parametrosCorte.where.estado = 'GENERADO';
          const dataCorteObs = await app.src.db.models.corte_mensual_observados.findAll(parametrosCorte);
          const dataReturn = dataCorte.concat(dataCorteObs);
          const dataReturnArray = [];

          // TODO: Se pondra el control de resultado respuesta vacia
          if (dataReturn.length > 0) {
            // dataReturn.forEach((item) => {
            for (let item of dataReturn) {
              const obj = item;
              obj.dataValues.mes = item.corte_mensual_mes.mes;
              if (obj.estado === 'REGISTRADO_SIGEP') {
                // Para identificar los casos que no corresponden pago
                const array_porcentaje = await app.dao.pcd.consultarPorcentajeMes(datosPcd.id_pcd, 2018, item.corte_mensual_mes.mes);
                const porcentaje = array_porcentaje[0].fn_porcentaje;
                if(porcentaje > 0 && porcentaje < 50){
                  obj.dataValues.observado = true;
                  obj.dataValues.observacion = util.traduccionObservacionCorte('Su certificado SIPRUNPCD ya expiro.');  
                } else {
                  obj.dataValues.observado = false;
                  obj.dataValues.observacion = 'HABILITADO';
                }
              } else if (obj.estado === 'GENERADO') {
                obj.dataValues.observado = true;
                obj.dataValues.observacion = obj.dataValues.observacion ? util.traduccionObservacionCorte(obj.dataValues.observacion) : 'En proceso de actualización.';
              } else {
                obj.dataValues.observado = Boolean(obj.dataValues.observacion);
                obj.dataValues.observacion = obj.dataValues.observacion ? util.traduccionObservacionCorte(obj.dataValues.observacion) : 'HABILITADO';
              }
              delete obj.dataValues.corte_mensual_mes;
              dataReturnArray.push(obj);
            };
            
            let nombreCompletoRegla = null;
            if (datosPcd.persona.formato_inf === 'NUAC') {
              nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || ''} ${datosPcd.persona.segundo_apellido || ''}`;
            } else {
              if (datosPcd.persona.formato_inf === 'U1AC' && datosPcd.persona.estado_civil === 'C') {
                nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || datosPcd.persona.segundo_apellido} de ${datosPcd.persona.casada_apellido || ''}`;
              }
              if (dataLogSigep.formato_inf === 'U1AC' && dataLogSigep.estado_civil === 'V') {
                nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || datosPcd.persona.segundo_apellido} Vda. de ${datosPcd.persona.casada_apellido || ''}`;
              }
              if (datosPcd.persona.formato_inf === 'UTAC' && datosPcd.persona.estado_civil === 'C') {
                nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || ''} ${datosPcd.persona.segundo_apellido || ''} de ${datosPcd.persona.casada_apellido || ''}`;
              }
              if (datosPcd.persona.formato_inf === 'UTAC' && datosPcd.persona.estado_civil === 'V') {
                nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || ''} ${datosPcd.persona.segundo_apellido || ''} Vda. de ${datosPcd.persona.casada_apellido || ''}`;
              }
            }
            let ciComplemento = datosPcd.persona.documento_identidad;
            if (datosPcd.persona.complemento_documento) {
              ciComplemento = `${datosPcd.persona.documento_identidad} - ${datosPcd.persona.complemento_documento}`;
            }
            // let nombreCompletoRegla = null;
            // if (dataLogSigep.formato_inf === 'NUAC') {
            //   nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || ''} ${dataLogSigep.segundo_apellido || ''}`;
            // } else {
            //   // Observacion encontrada cuando el primer apellido es vacio, se debe utilizar el segundo a pellido
            //   if (dataLogSigep.formato_inf === 'U1AC' && dataLogSigep.estado_civil === 'C') {
            //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || dataLogSigep.segundo_apellido} de ${dataLogSigep.apellido_casada}`;
            //   }
            //   if (dataLogSigep.formato_inf === 'U1AC' && dataLogSigep.estado_civil === 'V') {
            //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || dataLogSigep.segundo_apellido} Vda. de ${dataLogSigep.apellido_casada}`;
            //   }
            //   if (dataLogSigep.formato_inf === 'UTAC' && dataLogSigep.estado_civil === 'C') {
            //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || ''} ${dataLogSigep.segundo_apellido || ''} de ${dataLogSigep.apellido_casada}`;
            //   }
            //   if (dataLogSigep.formato_inf === 'UTAC' && dataLogSigep.estado_civil === 'V') {
            //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || ''} ${dataLogSigep.segundo_apellido || ''} Vda. de ${dataLogSigep.apellido_casada}`;
            //   }
            // }
            // let ciComplemento = dataLogSigep.numero_documento;
            // if (dataLogSigep.complemento) {
            //   ciComplemento = `${dataLogSigep.numero_documento} - ${dataLogSigep.complemento}`;
            // }
            // Para ordenar la respuesta
            dataReturnArray.sort(function(a, b){return a.corte_mensual_mes.mes - b.corte_mensual_mes.mes}); 

            const data = {
              numero_documento: ciComplemento,
              nombre_completo: nombreCompletoRegla,
              fecha_nacimiento: dataLogSigep.fecha_nacimiento,
              departamento: datosPcd.pcd_dpa.departamento,
              provincia: datosPcd.pcd_dpa.provincia,
              municipio: datosPcd.pcd_dpa.municipio,
              observacion: false,
              mensaje_observacion: null,
              datos_mes: dataReturnArray,
              encontrado: true,
              fecha: new Date()
            };
            res.status(200).json({
              finalizado: true,
              mensaje: 'Datos obtenidos exitosamente',
              datos: data,
            });
          } else {
            res.status(200).json({
              finalizado: true,
              mensaje: 'No se obtuvieron datos para su consulta.',
              datos: {
                encontrado: false,
                datos_mes: '',
              },
            });
          }
        } else {
          if (dataLogSigep) {
            // const causaError = JSON.parse(dataLogSigep.observacion).errores[0].causa;
            if (dataLogSigep.observacion !== null && dataLogSigep.observacion !== '' && IsJsonString(dataLogSigep.observacion)) {
              const observacionTraducida = util.reemplazarObservacion(JSON.parse(dataLogSigep.observacion).errores[0].mensaje);
              let nombreCompletoRegla = null;
              if (datosPcd.persona.formato_inf === 'NUAC') {
                nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || ''} ${datosPcd.persona.segundo_apellido || ''}`;
              } else {
                // Observacion encontrada cuando el primer apellido es vacio, se debe utilizar el segundo a pellido
                if (datosPcd.persona.formato_inf === 'U1AC' && datosPcd.persona.estado_civil === 'C') {
                  datosPcd.persona = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || datosPcd.persona.segundo_apellido} de ${datosPcd.persona.casada_apellido || ''}`;
                }
                if (datosPcd.persona.formato_inf === 'U1AC' && datosPcd.persona.estado_civil === 'V') {
                  nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || datosPcd.persona.segundo_apellido} Vda. de ${datosPcd.persona.casada_apellido || ''}`;
                }
                if (datosPcd.persona.formato_inf === 'UTAC' && datosPcd.persona.estado_civil === 'C') {
                  nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || ''} ${datosPcd.persona.segundo_apellido || ''} de ${datosPcd.persona.casada_apellido || ''}`;
                }
                if (datosPcd.persona.formato_inf === 'UTAC' && datosPcd.persona.estado_civil === 'V') {
                  nombreCompletoRegla = `${datosPcd.persona.nombres} ${datosPcd.persona.primer_apellido || ''} ${datosPcd.persona.segundo_apellido || ''} Vda. de ${datosPcd.persona.casada_apellido || ''}`;
                }
              }
              let ciComplemento = datosPcd.persona.documento_identidad;
              if (datosPcd.persona.complemento_documento) {
                ciComplemento = `${datosPcd.persona.documento_identidad} - ${datosPcd.persona.complemento_documento}`;
              }
              // let nombreCompletoRegla = null;
              // if (dataLogSigep.formato_inf === 'NUAC') {
              //   nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || ''} ${dataLogSigep.segundo_apellido || ''}`;
              // } else {
              //   // Observacion encontrada cuando el primer apellido es vacio, se debe utilizar el segundo a pellido
              //   if (dataLogSigep.formato_inf === 'U1AC' && dataLogSigep.estado_civil === 'C') {
              //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || dataLogSigep.segundo_apellido} de ${dataLogSigep.apellido_casada}`;
              //   }
              //   if (dataLogSigep.formato_inf === 'U1AC' && dataLogSigep.estado_civil === 'V') {
              //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || dataLogSigep.segundo_apellido} Vda. de ${dataLogSigep.apellido_casada}`;
              //   }
              //   if (dataLogSigep.formato_inf === 'UTAC' && dataLogSigep.estado_civil === 'C') {
              //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || ''} ${dataLogSigep.segundo_apellido || ''} de ${dataLogSigep.apellido_casada}`;
              //   }
              //   if (dataLogSigep.formato_inf === 'UTAC' && dataLogSigep.estado_civil === 'V') {
              //     nombreCompletoRegla = `${dataLogSigep.nombres} ${dataLogSigep.primer_apellido || ''} ${dataLogSigep.segundo_apellido || ''} Vda. de ${dataLogSigep.apellido_casada}`;
              //   }
              // }
              // let ciComplemento = dataLogSigep.numero_documento;
              // if (dataLogSigep.complemento) {
              //   ciComplemento = `${dataLogSigep.numero_documento} - ${dataLogSigep.complemento}`;
              // }
              const data = {
                numero_documento: ciComplemento,
                nombre_completo: nombreCompletoRegla,
                fecha_nacimiento: dataLogSigep.fecha_nacimiento,
                observacion: true,
                departamento: datosPcd.pcd_dpa.departamento,
                provincia: datosPcd.pcd_dpa.provincia,
                municipio: datosPcd.pcd_dpa.municipio,
                mensaje_observacion: observacionTraducida,
                encontrado: true,
                fecha: new Date(),
                datos_mes: '',
              };
              res.status(200).json({
                finalizado: true,
                mensaje: 'Datos obtenidos exitosamente',
                datos: data,
              });
            } else {
              res.status(412).json({
                finalizado: true,
                mensaje: 'No se pudo identificar la razón del caso observado, contáctese con la línea de soporte para más detalle.',
                datos: {
                  encontrado: false,
                },
              });
            }
          } else {
            res.status(200).json({
              finalizado: true,
              mensaje: 'No se obtuvieron datos para su consulta.',
              datos: {
                encontrado: false,
                datos_mes: '',
              },
            });
          }
        }
      } else {
        res.status(200).json({
          finalizado: true,
          mensaje: 'No se obtuvieron datos para su consulta.',
          datos: {
            encontrado: false,
            datos_mes: '',
          },
        });
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

  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const obtenerDatosSiprunCorteAnual = async (req, res) => {
    try {
      const gestion = req.query.gestion;
      const limite = req.query.limite;
      const pagina = req.query.pagina;
      logger.info('[pcd.controller][obtenerDatosSiprunCorteAnual]', 'gestion', 'limite', 'pagina ->', gestion, limite, pagina);
      // obtiene de la tabla temporal
      const datosSiprunpcd = await app.controller.tmp_siprunpcd.obtenerDatosTmpSiprunPcd(gestion, limite, pagina);
      // formato del servicio
      const usuarioAuditoria = req.body.audit_usuario.id_usuario;
      if (datosSiprunpcd && datosSiprunpcd.body && datosSiprunpcd.body.finalizado && datosSiprunpcd.body.datos) {
        if (datosSiprunpcd.body.datos && datosSiprunpcd.body.datos.length > 0) {
          const fechaPeticion = moment().format();
          logger.info('[pcd.controller][obtenerDatosSiprunCorteAnual]', 'fecha de peticion', 'fechaPeticion ->', fechaPeticion);
          const resultado = await crearPcdLoteCorteAnual(datosSiprunpcd, fechaPeticion, usuarioAuditoria);
          if (resultado) {
            const resObservados = await observarSiprunPCD(fechaPeticion, usuarioAuditoria);
            if (resObservados) {
              res.status(200).json({
                finalizado: true,
                mensaje: 'Creación/Actualización de registros exitoso.',
                datos: resultado
              });
            }
          } else {
            throw new Error('Error al crear/actualizar las personas con discapacidad.');
          }
        } else {
          throw new Error('No se encontraron registros.');
        }
      } else {
        throw new Error('Error al consultar el servicio del SIPRUNPCD.');
      }
    } catch (error) {
      logger.error('[pcd.controller][obtenerDatosSiprunCorteAnual] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  const verificarSinCI = async (req, res) => {
    try {
      const fechaNacimiento = moment(req.query.fecha_nacimiento, 'DD/MM/YYYY').format();
      const nombres = req.query.nombres;
      const primerApellido = req.query.primer_apellido || '';
      const segundoApellido = req.query.segundo_apellido || '';
      // const dataPersona = await app.dao.tmp_siprunpcd.buscarPersonaPorNombre(fechaNacimiento, nombres, primerApellido, segundoApellido);
      const dataPersona = await app.dao.pcd.buscarPersonaPorNombre(fechaNacimiento, nombres, primerApellido, segundoApellido);
      let resul = null;
      if (!dataPersona || dataPersona.length === 0) {
        // Buscar en la tabla temporal en caso de no encontrarlo en el original
        const consulta = { fecha_nacimiento: fechaNacimiento, nombres, tipo: 'SIPRUNPCD' };
        if (primerApellido && segundoApellido) {
          consulta.primer_apellido = primerApellido;
          consulta.segundo_apellido = segundoApellido;
        } else if (primerApellido) {
          consulta.primer_apellido = primerApellido;
        } else {
          consulta.segundo_apellido = segundoApellido;
        }
        resul = await app.dao.tmp_pcd.obtenerRegistroCompleto(consulta);
        let mensajeObs = '';

        if (resul) {
          // Identificamos todas las razones por las que se observaron por temas del SEGIP
          if (resul.observacion_contrastacion.indexOf("'HOMONIMIA'") > 0 || resul.observacion_contrastacion.indexOf("'OBSERVADO POR EL SEGIP'") > 0 || resul.observacion_contrastacion.indexOf("'FALLECIDO'") > 0 || resul.observacion_contrastacion.indexOf("'OBSERVADO POR LA APS'") > 0 || resul.observacion_contrastacion.indexOf("'DATOS PRIMARIOS ILEGIBLES'") > 0 || resul.observacion_contrastacion.indexOf("'TRAMITE ADMINISTRATIVO SEGIP'") > 0 || resul.observacion_contrastacion.indexOf("'MULTIPLE IDENTIDAD'") > 0 || resul.observacion_contrastacion.indexOf("'POSIBLE SUPLANTACION'") > 0) {
            mensajeObs = `El registro se encuentra con observaciones en la validación con el SEGIP. ${resul.observacion_contrastacion}`;
          } else if (resul.observacion_contrastacion.indexOf('429 -') > 0 || resul.observacion_contrastacion.indexOf('500 -') > 0 || resul.observacion_contrastacion.indexOf('504 -') > 0) {
            mensajeObs = 'El registro se encuentra con observaciones en la Plataforma.';
          } else {
            mensajeObs = 'El registro se encuentra con observaciones en la fuente del SIPRUNPCD.';
          }
          const resultado = resul.dataValues;
          const data = {
            numero_documento: resultado.complemento_documento ? `${resultado.documento_identidad} - ${resultado.complemento_documento}` : resul.documento_identidad,
            nombre_completo: util.formatearNombres(resultado),
            fecha_nacimiento: resultado.fecha_nacimiento,
            encontrado: true,
            fecha: new Date(),
            observacion: true,
            mensaje_observacion: mensajeObs,
          };
          res.status(200).json({
            finalizado: true,
            mensaje: mensajeObs,
            datos: data,
          });
        } else {
          res.status(200).json({
            finalizado: false,
            mensaje: 'La persona solicitada no se encuentra registrada.',
            datos: {
              encontrado: false,
            },
          });
        }
      } else {
        const data = {
          numero_documento: dataPersona[0].documento_identidad,
          nombre_completo: `${dataPersona[0].nombres} ${dataPersona[0].primer_apellido || ''} ${dataPersona[0].segundo_apellido || ''}`,
          fecha_nacimiento: dataPersona[0].fecha_nacimiento,
          observacion: true,
          departamento: dataPersona[0].departamento,
          provincia: dataPersona[0].provincia,
          municipio: dataPersona[0].municipio,
          mensaje_observacion: 'La persona solicitada fue identificada, realice la búsqueda por cédula de identidad.',
          encontrado: true,
        };
        res.status(200).json({
          finalizado: true,
          mensaje: 'Datos obtenidos exitosamente',
          datos: data,
        });
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

  const consulta = async (pDocumentoIdentidad, pFechaNacimiento, pGestion = null) => {
    let gestion;
    let mensaje = 'No se obtuvieron datos para su consulta.';
    let datos = { encontrado: false };

    if (pGestion) {
      gestion = pGestion;
    } else if (moment().format('MM-DD') >= '01-24') { // Obtener la gestion considerando el corte al 20 de enero
      gestion = moment().format('YYYY');
    } else {
      gestion = moment().format('YYYY') - 1;
    }
    const fechaNacimiento = moment(pFechaNacimiento, 'DD/MM/YYYY').format();
    const ciComplemento = pDocumentoIdentidad.split('-');
    const ci = ciComplemento[0];
    const complemento = ciComplemento.length > 1 ? ciComplemento[1] : null;
    logger.info('[pcd.controller][consulta]', 'ci, fechaNacimiento, complemento ->', ci, fechaNacimiento, complemento);

    let datosPcd;
    const resultado = await app.dao.pcd.obtenerPcd(ci, fechaNacimiento);
    if (resultado && resultado.length > 0) {
      if (resultado.length === 1) {
        datosPcd = resultado[0];
      } else if (complemento) {
        const resultadoComp = await app.dao.pcd.obtenerPcdComplemento(ciComplemento[0], ciComplemento[1], fechaNacimiento);
        if (resultadoComp) {
          datosPcd = resultadoComp;
        }
      } else {
        mensaje = 'Documento de identidad duplicado, debe ingresar complemento.';
      }
    }

    if (datosPcd) { // existe pcd
      logger.info('[pcd.controller][consulta]', 'idPcd ->', datosPcd.id_pcd);
      const dataLogSigep = await app.dao.pcd.obtenerLogServicioSigep({ fid_pcd: datosPcd.id_pcd });
      if (dataLogSigep) {
        logger.info('[pcd.controller][consulta]', 'id_log_servicio_sigep: ->', dataLogSigep.id_log_servicio_sigep);
        const di = datosPcd.persona.documento_identidad;
        const data = {
          numero_documento: datosPcd.persona.complemento_documento ? `${di} - ${datosPcd.persona.complemento_documento}` : di,
          nombre_completo: util.formatearNombres(datosPcd.persona),
          fecha_nacimiento: dataLogSigep.fecha_nacimiento,
          departamento: datosPcd.pcd_dpa.departamento,
          provincia: datosPcd.pcd_dpa.provincia,
          municipio: datosPcd.pcd_dpa.municipio,
          encontrado: true,
          fecha: new Date()
        };

        if (dataLogSigep.estado === 'ACTUALIZADO_SIGEP') {
          const dataCorte = await app.dao.corte.obtenerCorteMensual(datosPcd.id_pcd, gestion);
          const dataCorteObservados = await app.dao.corte.obtenerCorteMensualObservados(datosPcd.id_pcd, gestion);
          const dataReturn = dataCorte.concat(dataCorteObservados);
          const dataReturnArray = [];

          if (dataReturn.length > 0) {
            for (let item of dataReturn) {
              const obj = item;
              obj.dataValues.mes = item.corte_mensual_mes.mes;
              if (obj.estado === 'REGISTRADO_SIGEP') {
                obj.dataValues.observado = false;
                obj.dataValues.observacion = 'HABILITADO';
              } else if (obj.estado === 'GENERADO') {
                obj.dataValues.observado = true;
                obj.dataValues.observacion = obj.dataValues.observacion ? util.traduccionObservacionCorte(obj.dataValues.observacion) : 'En proceso de actualización.';
              } else {
                obj.dataValues.observado = Boolean(obj.dataValues.observacion);
                obj.dataValues.observacion = obj.dataValues.observacion ? util.traduccionObservacionCorte(obj.dataValues.observacion) : 'HABILITADO';
              }
              delete obj.dataValues.corte_mensual_mes;
              dataReturnArray.push(obj);
            }
            // Ordenar meses
            dataReturnArray.sort(function(a, b){return a.corte_mensual_mes.mes - b.corte_mensual_mes.mes});

            datos.observacion = false;
            datos.mensaje_observacion = null;
            datos = Object.assign(datos, data);
            datos.datos_mes = dataReturnArray;
            mensaje = 'Datos obtenidos exitosamente';
          }
        } else if (dataLogSigep.observacion !== null && dataLogSigep.observacion !== '' && IsJsonString(dataLogSigep.observacion)) {
          const observacionTraducida = util.reemplazarObservacion(JSON.parse(dataLogSigep.observacion).errores[0].mensaje);

          datos.observacion = true;
          datos.mensaje_observacion = observacionTraducida;
          datos = Object.assign(datos, data);
          mensaje = 'Datos obtenidos exitosamente';
        } else {
          mensaje = 'No se pudo identificar la razón del caso observado, contáctese con la línea de soporte para más detalle.';
        }
      }
    } else { // En caso de que se encuentra en la tabla temporal como observado
      // let resul = await app.dao.tmp_pcd.obtenerRegistro({ documento_identidad: ci, fecha_nacimiento: fechaNacimiento, tipo: 'SIPRUNPCD' });
      let resul = await app.dao.tmp_pcd.obtenerRegistroCompleto({ documento_identidad: ci, fecha_nacimiento: fechaNacimiento, tipo: 'SIPRUNPCD' });
      let mensajeObs = '';
      if (resul) {
        // Identificamos todas las razones por las que se observaron por temas del SEGIP
        if (resul.observacion_contrastacion.indexOf("'HOMONIMIA'") > 0 || resul.observacion_contrastacion.indexOf("'OBSERVADO POR EL SEGIP'") > 0 || resul.observacion_contrastacion.indexOf("'FALLECIDO'") > 0 || resul.observacion_contrastacion.indexOf("'OBSERVADO POR LA APS'") > 0 || resul.observacion_contrastacion.indexOf("'DATOS PRIMARIOS ILEGIBLES'") > 0 || resul.observacion_contrastacion.indexOf("'TRAMITE ADMINISTRATIVO SEGIP'") > 0 || resul.observacion_contrastacion.indexOf("'MULTIPLE IDENTIDAD'") > 0 || resul.observacion_contrastacion.indexOf("'POSIBLE SUPLANTACION'") > 0) {
          mensajeObs = `El registro se encuentra con observaciones en la validación con el SEGIP. ${resul.observacion_contrastacion}`;
        } else if (resul.observacion_contrastacion.indexOf('429 -') > 0 || resul.observacion_contrastacion.indexOf('500 -') > 0 || resul.observacion_contrastacion.indexOf('504 -') > 0) {
          mensajeObs = 'El registro se encuentra con observaciones en la Plataforma.';
        } else {
          mensajeObs = 'El registro se encuentra con observaciones en la fuente del SIPRUNPCD.';
        }
        resul = resul.dataValues;
        const data = {
          numero_documento: resul.complemento_documento ? `${resul.documento_identidad} - ${resul.complemento_documento}` : resul.documento_identidad,
          nombre_completo: util.formatearNombres(resul),
          fecha_nacimiento: resul.fecha_nacimiento,
          encontrado: true,
          fecha: new Date(),
        };
        datos.encontrado = true;
        datos.observacion = true;
        datos = Object.assign(datos, data);
        datos.mensaje_observacion = mensajeObs;
        mensaje = 'Datos obtenidos exitosamente';
      }
    }
    return { finalizado: true, mensaje, datos };
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

  const ciudadaniaConsulta = async (req, res) => {
    const { t: token, gestion } = req.query;
    let datos = {};

    try {
      const publicKey = fs.readFileSync(path.join('jwt-key', 'rsa-public.pem'));
      const resultado = jwt.verify(token, publicKey);
      if (resultado && resultado.usuario && resultado.fecha_nacimiento) {
        const documentoIdentidad = resultado.usuario;
        const fechaNacimiento = resultado.fecha_nacimiento;
        logger.info('[pcd.controller][ciudadaniaConsulta]', 'ci, fechaNac: ->', documentoIdentidad, fechaNacimiento);

        // Recuperamos información del certificado y bonos
        // const pcd = await obtenerCertificadoSiprun(documentoIdentidad);
        // datos.certificado = pcd.tcertificado ? pcd.tcertificado[0] : '';
        const datosbono = await consulta(documentoIdentidad, fechaNacimiento);
        datos.bonos = datosbono.datos.encontrado ? datosbono.datos : '';

        datos = JSON.stringify((datos));
        logger.info('[pcd.controller][ciudadaniaConsulta]', 'datos: ->', datos);

        res.render('index.ejs', { datos, token, gestion: (gestion || '') });
      } else {
        throw new Error('Usuario y fecha de nacimiento son requeridos.');
      }
    } catch (error) {
      logger.error('[pcd.controller][ciudadaniaConsulta] %s %j', 'error ->', error.message);
      let mensaje = null;
      if (error.message === ('invalid token' || 'jwt malformed' || 'invalid signature')) mensaje = 'El token es invalido.';

      res.render('index.ejs', { error: mensaje || error.message });
    }
  };

  const edicionPcd = async (req, res) => {
    const usuario = req.body.audit_usuario;
    try {
      let mensaje = '';
      let datos = {};
      const pcd = await app.dao.pcd.buscarPcdPorId(req.body.id_pcd);
      if (pcd) {
        const persona = await app.dao.persona.buscarPersona({ id_persona: pcd.fid_persona });
        const lss = await app.src.db.models.log_servicio_sigep.findOne({ where: { fid_pcd: req.body.id_pcd } });
        if (persona) {
          const whereTmpPcd = {
            documento_identidad: persona.documento_identidad,
            fecha_nacimiento: persona.fecha_nacimiento,
            estado_contrastacion: 'HABILITADO',
          };

          // Buscamos segun el parámetro que nos envíen
          if (req.body.documento_identidad) whereTmpPcd.documento_identidad = req.body.documento_identidad;
          else if (req.body.fecha_nacimiento) whereTmpPcd.fecha_nacimiento = req.body.fecha_nacimiento;

          const tmpPcd = await app.dao.tmp_pcd.obtenerRegistro(whereTmpPcd);
          let datosPersona = {};
          let control = 0;
          if (tmpPcd) {
            let validaComplemento = true;
            // Controlamos que solo se realizara un ajuste a la vez
            if (req.body.documento_identidad) {
              // Validacion para que el parametro no sea igual
              if (req.body.documento_identidad === persona.documento_identidad) throw new Error('El número de documento introducido, es el mismo.');
              datosPersona.NumeroDocumento = req.body.documento_identidad;
              control += 1;
            } else {
              datosPersona.NumeroDocumento = tmpPcd.documento_identidad;
            }

            if (req.body.complemento) {
              // Validacion para que el parametro no sea igual
              if (req.body.complemento === persona.complemento_documento) throw new Error('El complemento introducido, es el mismo.');
              datosPersona.Complemento = req.body.complemento;
              control += 1;
              validaComplemento = (req.body.complemento === tmpPcd.complemento_documento);
            } else {
              datosPersona.Complemento = tmpPcd.complemento_documento;
            }

            if (req.body.fecha_nacimiento) {
              // Validar que el parametro no sea igual
              if (req.body.fecha_nacimiento === persona.fecha_nacimiento) throw new Error('La fecha de nacimiento introducida, es el mismo.');
              datosPersona.FechaNacimiento = moment(req.body.fecha_nacimiento).format('DD/MM/YYYY');
              control += 1;
            } else {
              datosPersona.FechaNacimiento = moment(tmpPcd.fecha_nacimiento).format('DD/MM/YYYY');
            }

            if (req.body.nombres) {
              control += 1;
              datosPersona.Nombres = tmpPcd.nombres;
              datosPersona.PrimerApellido = tmpPcd.primer_apellido ? tmpPcd.primer_apellido : '--';
              datosPersona.SegundoApellido = tmpPcd.segundo_apellido ? tmpPcd.segundo_apellido : '--';
            } else {
              datosPersona.Nombres = persona.nombres;
              datosPersona.PrimerApellido = persona.primer_apellido ? persona.primer_apellido : '--';
              datosPersona.SegundoApellido = persona.segundo_apellido ? persona.segundo_apellido : '--';
            }
            // Control para evitar que no se ajuste por más de un parámetro a la vez
            if (control <= 1) {
              // Control de la validacion del complemento
              if (validaComplemento) {
                const gestionCarga = Number(moment().format('D')) <= 20 ? moment().format('YYYY') : moment().add(1, 'month').format('YYYY');
                const mesCarga = Number(moment().format('D')) <= 20 ? moment().format('M') : moment().add(1, 'month').format('M');
                // const consultaRegistroTmpPcdLog = await app.dao.tmp_pcd.consultaRegistroTmpPcdLog(tmpPcd.id, mesCarga, gestionCarga);

                // Control de que se realice solamente un registro de actualización al mes segun la fecha de actualizacion en persona (Solo en modificacion de parametros)
                // if (consultaRegistroTmpPcdLog[0].cantidad <= 1) {
                if (!(moment(persona._fecha_modificacion).format('YYYY') === gestionCarga && moment(persona._fecha_modificacion).format('M') === mesCarga && control === 1)) {
                  // No realiza la contrastación en caso de que no se modifique valores de parametros
                  let validaContrastacion = true;
                  let verificaSegip = null;
                  if (control === 1) {
                    verificaSegip = await segip.contrastacion(datosPersona);
                    validaContrastacion = verificaSegip.finalizado;
                  }

                  // Actualiza datos en la tabla temporal
                  const tmpPcdUpt = {
                    gestion_carga: gestionCarga,
                    mes_carga: mesCarga,
                    _usuario_modificacion: usuario.id_usuario,
                  };
                  if (validaContrastacion) {
                    let personaUpt = {
                      _usuario_modificacion: usuario.id_usuario,
                    };
                    let lssUpt = {
                      estado: 'CREADO',
                      observacion: '',
                      _usuario_modificacion: usuario.id_usuario,
                    };
                    // Consultamos si se ha solicitado ajustar de parametros
                    if (req.body.documento_identidad) {
                      personaUpt.documento_identidad = req.body.documento_identidad;

                      lssUpt.numero_documento = req.body.documento_identidad;
                    }
                    if (req.body.complemento_documento) {
                      personaUpt.complemento_documento = tmpPcd.complemento_documento;

                      lssUpt.complemento_documento = tmpPcd.complemento_documento;
                    }
                    if (req.body.fecha_nacimiento) {
                      personaUpt.fecha_nacimiento = req.body.fecha_nacimiento;

                      lssUpt.fecha_nacimiento = req.body.fecha_nacimiento;
                    }
                    if (req.body.nombres) {
                      personaUpt.primer_apellido = tmpPcd.primer_apellido ? tmpPcd.primer_apellido.toUpperCase() : '';
                      personaUpt.segundo_apellido = tmpPcd.segundo_apellido ? tmpPcd.segundo_apellido.toUpperCase() : '';
                      personaUpt.nombres = tmpPcd.nombres.toUpperCase();

                      lssUpt.primer_apellido = tmpPcd.primer_apellido ? tmpPcd.primer_apellido.toUpperCase() : '';
                      lssUpt.segundo_apellido = tmpPcd.segundo_apellido ? tmpPcd.segundo_apellido.toUpperCase() : '';
                      lssUpt.nombres = tmpPcd.nombres.toUpperCase();
                    }
                    // Consultamos si se ha solicitado ajustar otros campos
                    if (req.body.otros) {
                      personaUpt.casada_apellido = tmpPcd.casada_apellido ? tmpPcd.casada_apellido : '';
                      personaUpt.estado_civil = tmpPcd.estado_civil;
                      personaUpt.formato_inf = tmpPcd.formato_inf;
                      personaUpt.expedido = tmpPcd.expedido;
                      personaUpt.telefono = tmpPcd.telefono;
                      personaUpt.direccion = tmpPcd.direccion;

                      lssUpt.apellido_casada = tmpPcd.casada_apellido ? tmpPcd.casada_apellido : '';
                      lssUpt.estado_civil = tmpPcd.estado_civil;
                      lssUpt.formato_inf = tmpPcd.formato_inf;
                      lssUpt.expedido = tmpPcd.expedido;
                      lssUpt.telefono = tmpPcd.telefono;
                      lssUpt.direccion = tmpPcd.direccion;
                    }

                    datos = tmpPcd;
                    mensaje = 'Datos personales actualizados exitosamente.';
                    const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
                      if (lss) {
                        await app.src.db.models.log_servicio_sigep.update(lssUpt, { where: { fid_pcd: req.body.id_pcd } });
                      }
                      await app.dao.persona.actualizarPersona(pcd.fid_persona, personaUpt);
                      await app.dao.tmp_pcd.actualizar(req.body.id_pcd, tmpPcdUpt);
                    });
                    await app.dao.tmp_pcd.crearTmpPcdLog({ datos: pcd, _usuario_creacion: usuario.id_usuario, tipo_caso: 'TMPPCD' });
                    if (transaccion.finalizado) {
                      return res.status(200).json({
                        finalizado: true,
                        mensaje,
                        datos,
                      });
                    } else {
                      throw new Error(transaccion.mensaje);
                    }
                  } else {
                    mensaje = `No se pudo actualizar, problema al contrastar con SEGIP: ${verificaSegip.mensaje}. <br>${verificaSegip.datos}`;
                  }
                } else {
                  mensaje = `Ya se realizo una actualización para el periodo ${mesCarga}/${gestionCarga}.`;
                }
              } else {
                mensaje = 'No puede realizar la actualización, el valor del complemnto varia. Consulte al SIPRUN.';
              }
            } else {
              mensaje = 'No puede realizar la actualización de los datos del carnet de identidad, fecha e nacimiento y nombres a la vez.';
            }
          } else {
            mensaje = 'No se encontró resultado para la solicitud, consulte con la información del SIPRUN.';
          }
        } else {
          mensaje = 'No se encontró resultado para la solicitud.';
        }
      } else {
        mensaje = 'No se encontró resultado para la solicitud.';
      }

      res.status(412).json({
        finalizado: true,
        mensaje,
        datos,
      });
    } catch (error) {
      logger.error('[pcd.controller][edicionPcd] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };
  const inhabilitarPcd = async (req, res) => {
    const usuario = req.body.audit_usuario;
    try {
      let mensaje = '';
      let datos = {};
      const pcd = await app.dao.pcd.buscarPcdPorId(req.body.id_pcd);
      if (pcd) {
        const persona = await app.dao.persona.buscarPersona({ id_persona: pcd.fid_persona });
        if (persona) {
          const whereTmpPcd = {
            documento_identidad: persona.documento_identidad,
            fecha_nacimiento: persona.fecha_nacimiento,
            estado_contrastacion: 'HABILITADO',
          };

          const tmpPcd = await app.dao.tmp_pcd.obtenerRegistro(whereTmpPcd);
          if (tmpPcd) {
            const gestionCarga = Number(moment().format('D')) <= 20 ? moment().format('YYYY') : moment().add(1, 'month').format('YYYY');
            const mesCarga = Number(moment().format('D')) <= 20 ? moment().format('M') : moment().add(1, 'month').format('M');

            // Actualiza datos en la tabla temporal
            const tmpPcdUpt = {
              estado: 'INACTIVO',
              gestion_carga: gestionCarga,
              mes_carga: mesCarga,
              _usuario_modificacion: usuario.id_usuario,
            };

            // Actualizar datos de la persona con discapacidad
            const pcdUpt = {
              estado: 'INACTIVO',
              observacion: req.body.descripcion,
              _usuario_modificacion: usuario.id_usuario,
            };

            datos = tmpPcd;
            mensaje = 'Datos actualizados exitosamente.';
            const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
              await app.dao.pcd.actualizarMunicipioPcd(pcd.id_pcd, pcdUpt);
              await app.dao.tmp_pcd.actualizar(tmpPcd.id, tmpPcdUpt);
            });
            await app.dao.tmp_pcd.crearTmpPcdLog({ datos: pcd, _usuario_creacion: usuario.id_usuario, tipo_caso: 'TMPPCD' });
            if (transaccion.finalizado) {
              return res.status(200).json({
                finalizado: true,
                mensaje,
                datos,
              });
            } else {
              throw new Error(transaccion.mensaje);
            }
          } else {
            mensaje = 'No se encontró resultado para la solicitud, consulte con la información del SIPRUN.';
          }
        } else {
          mensaje = 'No se encontró resultado para la solicitud.';
        }
      } else {
        mensaje = 'No se encontró resultado para la solicitud.';
      }

      res.status(412).json({
        finalizado: true,
        mensaje,
        datos,
      });
    } catch (error) {
      logger.error('[pcd.controller][edicionPcd] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listarPcdBeneficio = async (req, res) => {
    try {
      const beneficios = await app.dao.pcd.listarPcdBeneficio(req.query);
      if (beneficios && beneficios.rows && beneficios.rows.length > 0) {
        logger.info('[pcd.controller][listarPcdBeneficio]', 'pcd.rows.length ->', beneficios.rows.length);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de datos exitoso.',
          datos: {
            count: beneficios.count,
            rows: beneficios.rows,
          },
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      logger.error('[pcd.controller][listarPcdBeneficio] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.pcd = {
    status,
    listarPcd,
    crearPcd,
    crearPcdLote,
    obtenerDatosSiprun,
    obtenerDatosSiprunCi,
    obtenerDatosIBC,
    obtenerDatosOvt,
    mostrarDetallePcd,
    obtenerDatosSiprunCorteAnual,
    verificar,
    ciudadaniaConsulta,
    edicionPcd,
    inhabilitarPcd,
    listarPcdBeneficio,
  };
};
