/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import moment from 'moment';
import logger from './../../../lib/logger';

module.exports = (app) => {
  const _app = app;

  const obtenerPcdCertificados = async (req, res) => {
    const parametros = {
      documento_identidad: req.params.ci,
    };
    if (req.query) {
      if (req.query.fecha_nacimiento) {
        parametros.fecha_nacimiento = req.query.fecha_nacimiento;
      }
      if (req.query.complemento_documento) {
        parametros.complemento_documento = req.query.complemento_documento;
      }
    }
    logger.info('[servicio.controller][obtenerPcdCertificados] %s %j', 'parametros ->', parametros);
    try {
      const pcd = await app.dao.servicio.obtenerPcd(parametros);
      logger.info('[servicio.controller][obtenerPcdCertificados]', 'pcd.length ->', pcd.length);
      if (pcd.length > 0) {
        if (pcd.length === 1) {
          const respuesta = {
            documento_identidad: pcd[0].persona.documento_identidad,
            complemento_documento: pcd[0].persona.complemento_documento,
            nombre: pcd[0].persona.nombre_completo,
            fecha_nacimiento: moment(pcd[0].persona.fecha_nacimiento).format('DD/MM/YYYY'),
            sexo: pcd[0].persona.sexo,
            correo_electronico: pcd[0].persona.correo_electronico,
            direccion: pcd[0].persona.direccion,
            telefono: pcd[0].persona.telefono,
            cod_municipio: pcd[0].pcd_dpa.dataValues.cod_municipio,
            municipio: pcd[0].pcd_dpa.municipio,
            provincia: pcd[0].pcd_dpa.provincia,
            departamento: pcd[0].pcd_dpa.departamento,
            observacion: pcd[0].observacion,
          };
          let certificado = {};
          const obtenerCertificadoMax = await app.dao.servicio.obtenerCertificadoMax(pcd[0].id_pcd);
          logger.info('[servicio.controller][obtenerPcdCertificados] %s %j', 'obtenerCertificadoMax ->', obtenerCertificadoMax);
          if (obtenerCertificadoMax) {
            const obtenerCertificado = await app.dao.servicio.obtenerCertificado(pcd[0].id_pcd, obtenerCertificadoMax);
            if (obtenerCertificado) {
              certificado = {
                tipo_certificado: obtenerCertificado.tipo_certificado,
                numero_registro: obtenerCertificado.numero_registro,
                tipo_discapacidad: obtenerCertificado.tipo_discapacidad,
                grado_discapacidad: obtenerCertificado.grado_discapacidad,
                porcentaje_discapacidad: obtenerCertificado.porcentaje_discapacidad,
                fecha_vigencia: moment(obtenerCertificado.fecha_vigencia).format('DD/MM/YYYY'),
                fecha_emision: moment(obtenerCertificado.fecha_emision).format('DD/MM/YYYY'),
              };
            }
          }
          respuesta.certificado = certificado;

          res.status(200).json({
            codigo: 1,
            finalizado: true,
            mensaje: 'Obtencion de datos exitoso.',
            datos: respuesta,
          });
        } else {
          res.status(200).json({
            codigo: 0,
            finalizado: true,
            mensaje: 'Se encontro mas de un registro.',
            datos: {},
          });
        }
      } else {
        res.status(204).json({
          codigo: 0,
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      logger.error('[servicio.controller][crearPcdBeneficio]', 'error ->', error.message);
      res.status(412).json({
        codigo: 0,
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const crearBeneficiario = async (datos, beneficio, usuarioAuditoria) => {
    const datosPersona = {
      documento_identidad: datos.documento_identidad,
      fecha_nacimiento: moment(datos.fecha_nacimiento, 'DD/MM/YYYY').format(),
      fid_tipo_documento: 100,
    };
    logger.info('[servicio.controller][crearBeneficiario] %s %j', 'datosPersona ->', datosPersona);

    // buscamos persona
    const buscaPersona = await app.dao.persona.buscarPersona(datosPersona);
    if (buscaPersona) { // existe registro de la persona
      logger.info('[servicio.controller][crearBeneficiario] %s %j', 'persona ->', buscaPersona);
      // buscamos PCD
      const obtenerPcd = await app.dao.pcd.buscarPcd(buscaPersona.id_persona);

      if (obtenerPcd) { // existe PCD
        const datosPcdBeneficio = {
          fid_pcd: obtenerPcd.id_pcd,
          fid_beneficio: beneficio.id_beneficio,
          estado: 'ACTIVO',
        };
        if (datos.nit) {
          datosPcdBeneficio.nit = datos.nit;
        }
        if (datos.matricula) {
          datosPcdBeneficio.matricula = datos.matricula;
        }

        // buscamos PcdBeneficio
        logger.info('[servicio.controller][crearBeneficiario] %s %j', 'datosPcdBeneficio ->', datosPcdBeneficio);
        const obtenerPcdBeneficio = await app.dao.pcd_beneficio.buscarPcdBeneficio(datosPcdBeneficio);

        if (datos.fecha_fin) {
          datosPcdBeneficio.fecha_fin = moment(datos.fecha_fin, 'DD/MM/YYYY').format();
          datosPcdBeneficio.estado = 'INACTIVO';
        }

        logger.info('[servicio.controller][crearBeneficiario] %s %j', 'datosPcdBeneficio actualizado ->', datosPcdBeneficio);
        if (obtenerPcdBeneficio) { // existe registro beneficio
          datosPcdBeneficio._usuario_modificacion = usuarioAuditoria;
          await app.dao.pcd_beneficio.actualizarPcdBeneficio(obtenerPcdBeneficio, datosPcdBeneficio);
          // para log
          datosPcdBeneficio.fecha_inicio = moment(datos.fecha_inicio, 'DD/MM/YYYY').format();
          datosPcdBeneficio.tipo = datos.tipo;
          datosPcdBeneficio.descripcion = datos.descripcion;
          datosPcdBeneficio.observacion = datos.observacion;
          datosPcdBeneficio._usuario_creacion = usuarioAuditoria;
          if (datos.fid_tutor_ovt) {
            datosPcdBeneficio.fid_tutor_ovt = datos.fid_tutor_ovt;
          }
        } else {
          datosPcdBeneficio.fecha_inicio = moment(datos.fecha_inicio, 'DD/MM/YYYY').format();
          datosPcdBeneficio.tipo = datos.tipo;
          datosPcdBeneficio.descripcion = datos.descripcion;
          datosPcdBeneficio.observacion = datos.observacion;
          if (datos.fid_tutor_ovt) {
            datosPcdBeneficio.fid_tutor_ovt = datos.fid_tutor_ovt;
          }
          datosPcdBeneficio._usuario_creacion = usuarioAuditoria;
          await app.dao.pcd_beneficio.crearPcdBeneficio(datosPcdBeneficio);
        }
        // datosPcdBeneficio._fecha_creacion = moment(datos.pcd_fecha_envio, 'DD/MM/YYYY').format();
        await app.dao.pcd_beneficio.crearPcdBeneficioLog(datosPcdBeneficio);
      }
    }
    return true;
  };

  const crearBeneficiarioLog = async (datos, beneficio, usuarioAuditoria) => {
    const filtro = {
      fid_beneficio: beneficio.id_beneficio,
      estado: 'ACTIVO',
      documento_identidad: datos.documento_identidad,
      complemento_documento: datos.complemento_documento,
      nombres: datos.nombres,
      primer_apellido: datos.primer_apellido,
      segundo_apellido: datos.segundo_apellido,
      fecha_nacimiento: datos.fecha_nacimiento,
      tipo_documento_identidad: 100,
      mes: datos.mes,
      fid_gestion: datos.gestion,
      modalidad_contrato: datos.modalidad_contrato,
    };

    const obtenerPcdBeneficioLog = await app.dao.pcd_beneficio.buscarPcdBeneficioLog(filtro);

    if (!obtenerPcdBeneficioLog) {
      const datosPcdBeneficio = {
        fid_pcd: null,
        fid_beneficio: beneficio.id_beneficio,
        estado: 'ACTIVO',
        documento_identidad: datos.documento_identidad,
        complemento_documento: datos.complemento_documento,
        nombres: datos.nombres,
        primer_apellido: datos.primer_apellido,
        segundo_apellido: datos.segundo_apellido,
        fecha_nacimiento: datos.fecha_nacimiento,
        tipo_documento_identidad: 100,
      };
      if (datos.nit) {
        datosPcdBeneficio.nit = datos.nit;
      }
      if (datos.matricula) {
        datosPcdBeneficio.matricula = datos.matricula;
      }

      logger.info('[servicio.controller][crearBeneficiarioLog] %s %j', 'datosPcdBeneficio actualizado ->', datosPcdBeneficio);
      datosPcdBeneficio.fecha_inicio = moment(datos.fecha_inicio, 'DD/MM/YYYY').format();
      datosPcdBeneficio.tipo = datos.tipo;
      datosPcdBeneficio.descripcion = datos.descripcion;
      datosPcdBeneficio.observacion = datos.observacion;

      if (datos.fid_tutor_ovt) {
        datosPcdBeneficio.fid_tutor_ovt = datos.fid_tutor_ovt;
      }
      datosPcdBeneficio._usuario_creacion = usuarioAuditoria;

      datosPcdBeneficio.mes = datos.mes;
      datosPcdBeneficio.fid_gestion = datos.gestion;
      datosPcdBeneficio.modalidad_contrato = datos.modalidad_contrato;
      await app.dao.pcd_beneficio.crearPcdBeneficioLog(datosPcdBeneficio);
    }
    return true;
  };

  const crearBeneficiarioMes = async (datos, beneficio, usuarioAuditoria) => {
    await crearBeneficiarioLog(datos, beneficio, usuarioAuditoria);
    const datosPersona = {
      documento_identidad: datos.documento_identidad,
      fecha_nacimiento: moment(datos.fecha_nacimiento, 'DD/MM/YYYY').format(),
      fid_tipo_documento: 100
    };
    logger.info('[servicio.controller][crearBeneficiarioMes] %s %j', 'datosPersona ->', datosPersona);

    // buscamos persona
    const buscaPersona = await app.dao.persona.buscarPersona(datosPersona);
    if (buscaPersona) { // existe registro de la persona
      logger.info('[servicio.controller][crearBeneficiarioMes] %s %j', 'persona ->', buscaPersona);
      // buscamos PCD
      const obtenerPcd = await app.dao.pcd.buscarPcd(buscaPersona.id_persona);

      if (obtenerPcd) { // existe PCD
        const datosPcdBeneficio = {
          fid_pcd: obtenerPcd.id_pcd,
          fid_beneficio: beneficio.id_beneficio,
          estado: 'ACTIVO',
          mes: parseInt(datos.mes) === 12 ? 1 : (parseInt(datos.mes) + 1),
          fid_gestion: parseInt(datos.mes) === 12 ? (parseInt(datos.gestion) + 1) : parseInt(datos.gestion)
        };
        if (datos.nit) {
          datosPcdBeneficio.nit = datos.nit;
        }
        if (datos.matricula) {
          datosPcdBeneficio.matricula = datos.matricula;
        }

        // buscamos PcdBeneficio
        logger.info('[servicio.controller][crearBeneficiarioMes] %s %j', 'datosPcdBeneficio ->', datosPcdBeneficio);
        const obtenerPcdBeneficio = await app.dao.pcd_beneficio.buscarPcdBeneficioMes(datosPcdBeneficio);

        if (datos.fecha_fin) {
          datosPcdBeneficio.fecha_fin = moment(datos.fecha_fin, 'DD/MM/YYYY').format();
          datosPcdBeneficio.estado = 'INACTIVO';
        }

        logger.info('[servicio.controller][crearBeneficiarioMes] %s %j', 'datosPcdBeneficio actualizado ->', datosPcdBeneficio);
        if (!obtenerPcdBeneficio) {
          datosPcdBeneficio.fecha_inicio = moment(datos.fecha_inicio, 'DD/MM/YYYY').format();
          datosPcdBeneficio.tipo = datos.tipo;
          datosPcdBeneficio.descripcion = datos.descripcion;
          datosPcdBeneficio.observacion = datos.observacion;

          if (datos.fid_tutor_ovt) {
            datosPcdBeneficio.fid_tutor_ovt = datos.fid_tutor_ovt;
          }
          datosPcdBeneficio._usuario_creacion = usuarioAuditoria;
          await app.dao.pcd_beneficio.crearPcdBeneficioMes(datosPcdBeneficio);
          // datosPcdBeneficio.mes = datos.mes;
          // datosPcdBeneficio.fid_gestion = datos.gestion;
          // datosPcdBeneficio.modalidad_contrato = datos.modalidad_contrato;
          // await app.dao.pcd_beneficio.crearPcdBeneficioLog(datosPcdBeneficio);
        }
      }
    }
    return true;
  };

  const crearPcdBeneficio = async (req, res) => {
    try {
      const datosBody = req.body;
      const usuarioAuditoria = req.body.audit_usuario.id_usuario;
      // buscar beneficio asociado al rol
      logger.info('[servicio.controller][crearPcdBeneficio] %s %j', 'datosBody.audit_usuario ->', datosBody.audit_usuario);      
      const obtenerBeneficio = await app.dao.pcd_beneficio.buscarBeneficio(datosBody.audit_usuario);
      if (obtenerBeneficio) {
        if (obtenerBeneficio.empresa && !datosBody.nit) {
          throw new Error('El parametro nit es requerido.');
        }
        const datosPcd = {};
        datosPcd.fecha_inicio = datosBody.fecha_inicio;
        datosPcd.fecha_fin = datosBody.fecha_fin;
        datosPcd.nit = datosBody.nit;
        datosPcd.matricula = datosBody.matricula;
        datosPcd.descripcion = datosBody.descripcion;
        datosPcd.observacion = datosBody.observacion;
        datosPcd.mes = datosBody.mes;
        datosPcd.gestion = datosBody.gestion;
        datosPcd.modalidad_contrato = datosBody.modalidad_contrato;
        // datosPcd.pcd_fecha_envio = datosBody.pcd_fecha_envio;
        if (datosBody.tipo === 'pcd') {
          logger.info('[servicio.controller][crearPcdBeneficio]', 'tipo PCD');
          datosPcd.documento_identidad = datosBody.documento_identidad;
          datosPcd.complemento_documento = datosBody.complemento_documento;
          datosPcd.nombres = datosBody.nombres;
          datosPcd.primer_apellido = datosBody.primer_apellido;
          datosPcd.segundo_apellido = datosBody.segundo_apellido;
          datosPcd.fecha_nacimiento = datosBody.fecha_nacimiento;
          datosPcd.tipo = 'DIRECTO';
          // await crearBeneficiario(datosPcd, obtenerBeneficio, usuarioAuditoria);
          await crearBeneficiarioMes(datosPcd, obtenerBeneficio, usuarioAuditoria);
        } else if (datosBody.tipo === 'tutor') {
          logger.info('[servicio.controller][crearPcdBeneficio]', 'tipo TUTOR');
          if (datosBody.pcd && datosBody.pcd.length > 0) {
            const datosTutor = {
              documento_identidad: datosBody.documento_identidad,
              fecha_nacimiento: moment(datosBody.fecha_nacimiento, 'DD/MM/YYYY').format(),
              tipo_documento_identidad: 100,
            };
            const obtenerTutorOvt = await app.dao.tutor_ovt.obtenerTutorOvt(datosTutor);
            logger.info('[servicio.controller][crearPcdBeneficio] %s %j', 'obtenerTutorOvt ->', obtenerTutorOvt);
            if (obtenerTutorOvt) {
              datosPcd.fid_tutor_ovt = obtenerTutorOvt.id_tutor_ovt;
            } else {
              datosTutor.complemento_documento = datosBody.complemento_documento;
              datosTutor.nombres = datosBody.nombres;
              datosTutor.primer_apellido = datosBody.primer_apellido;
              datosTutor.segundo_apellido = datosBody.segundo_apellido;
              datosTutor.observacion = datosBody.observacion;
              datosTutor._usuario_creacion = usuarioAuditoria;
              const crearTutorOVT = await app.dao.tutor_ovt.crearTutorOvt(datosTutor);
              datosPcd.fid_tutor_ovt = crearTutorOVT.id_tutor_ovt;
            }
            datosPcd.tipo = 'INDIRECTO';
            for (let item of datosBody.pcd) {
              datosPcd.documento_identidad = item.documento_identidad;
              datosPcd.complemento_documento = item.complemento_documento;
              datosPcd.nombres = item.nombres;
              datosPcd.primer_apellido = item.primer_apellido;
              datosPcd.segundo_apellido = item.segundo_apellido;
              datosPcd.fecha_nacimiento = item.fecha_nacimiento;
              logger.info('[servicio.controller][crearPcdBeneficio] %s %j', 'datosPcd ->', datosPcd);
              // await crearBeneficiario(datosPcd, obtenerBeneficio, usuarioAuditoria);
              await crearBeneficiarioMes(datosPcd, obtenerBeneficio, usuarioAuditoria);
            }
          } else {
            throw new Error('El parametro pcd es requerido.');
          }
        } else {
          throw new Error('El parametro tipo debe ser \'pcd\' o \'tutor\'.');
        }
      } else {
        throw new Error('No existe el registro del beneficio asociado al rol del usuario.');
      }
      res.status(200).json({
        codigo: 1,
        finalizado: true,
        mensaje: 'Registro exitoso.',
        datos: {},
      });
    } catch (error) {
      logger.error('[servicio.controller][crearPcdBeneficio]', 'error ->', error.message);
      res.status(412).json({
        codigo: 0,
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.servicio = {
    obtenerPcdCertificados,
    crearPcdBeneficio,
  };
};
