/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import moment from 'moment';
import logger from './../../../lib/logger';

const fs = require('fs-extra');
const Json2csvParser = require('json2csv').Parser;

module.exports = (app) => {
  const _app = app;

  const crearDocumento = async (path, dataBase64, tipo, ci) => {
    try {
      // leemos el base 64
      const array = dataBase64.split(',');
      if (array[0] !== 'data:application/pdf;base64' && array[0] !== 'data:image/png;base64' && array[0] !== 'data:image/jpg;base64' && array[0] !== 'data:image/jpeg;base64') {
        throw new Error('El archivo adjunto no tiene el formato esperado. Por favor, intente subir un archivo del tipo PDF, JPG o PNG. ');
      }
      const buffer = new Buffer(array[1], 'base64');
      if (!fs.existsSync(path)) {
        fs.mkdirsSync(path);
      }
      const fecha = moment().format('YYYYMMDDhhmmss');
      let extension = 'pdf';
      if (array[0] === 'data:application/pdf;base64') {
        extension = 'pdf';
      } else if (array[0] === 'data:image/png;base64') {
        extension = 'png';
      } else {
        extension = 'jpg';
      }
      const nombreArchivo = `${ci}_${tipo}_${fecha}.${extension}`;
      fs.writeFileSync(`${path}${nombreArchivo}`, buffer);
      return `${nombreArchivo}`;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const crearDomicilio = async (req, res) => {
    let documentoSiprun = null;
    // let documentoFactura = null;
    const path = `${_path}/files/domicilio/`;
    try {
      // this.FechaPlazo = new Date(this.FechaActualCliente.getFullYear() +'-06-20 23:59:59');
      // if (fechaActual > new Date(`${moment().format('YYYY')}-04-01 23:59:59`)) {
      // Según nota se ajusto el plazo para la gestión 2021 desde el 1 de abril hasta el 30 de junio
      const fechaActual = new Date();
      const fechaInicio = new Date(fechaActual.getFullYear() +'-04-01 00:00:00');
      const fechaPlazo = new Date(fechaActual.getFullYear() +'-06-30 23:59:59');
      if (!(fechaActual.getTime() <= fechaPlazo.getTime() && fechaActual.getTime() >= fechaInicio.getTime())) {
        throw new Error('No se encuentra dentro de las fechas permitidas para realizar el registro de cambio de domicilio.');
      }
      logger.info('[domicilio.controller][creaDomicilio]', 'body->', req.body);
      // if (!req.body.documento_siprun) {
      //   throw new Error('El carnet del SIPRUN es requerido.');
      // }
      // if (!req.body.domicilio && !req.body.documento_factura) {
      //   throw new Error('La factura es requerido.');
      // }
      const gestion = moment().format('YYYY');
      const domicilio = await app.dao.domicilio.obtenerDomicilio(req.body.documento_identidad, req.body.fecha_nacimiento, gestion);
      if (domicilio.length > 0) {
        throw new Error('Ya se realizó la modificación de domicilio para la persona en la presente gestión.');
      }
      const pcd = await app.dao.pcd.obtenerPcdCompleto(req.body.documento_identidad, req.body.fecha_nacimiento);
      if (!pcd) {
        throw new Error('La persona no se encuentra registrada como PCD.');
      }
      const dpa = await app.dao.dpa.obtenerIdDpa(req.body.cod_municipio);
      if (!dpa) {
        throw new Error('El municipio no se encuentra registrado en el sistema.');
      }
      if (documentoSiprun) {
        documentoSiprun = await crearDocumento(path, req.body.documento_siprun, 'siprun', pcd.persona.documento_identidad);
      }
      // if (!req.body.domicilio) {
      //   documentoFactura = await crearDocumento(path, req.body.documento_factura, 'factura', pcd.persona.documento_identidad);
      // }
      const datos = {
        documento_identidad: pcd.persona.documento_identidad,
        gestion,
        fecha_nacimiento: pcd.persona.fecha_nacimiento,
        cod_municipio_vigente: pcd.pcd_dpa.cod_municipio,
        cod_municipio_nuevo: dpa.cod_municipio,
        direccion: req.body.direccion.replace(/\|/g, ' '),
        ci_solicitante: req.body.ci_solicitante.replace(/\|/g, ' '),
        solicitante: req.body.solicitante.replace(/\|/g, ' '),
        fid_pcd: pcd.id_pcd,
        fid_persona: pcd.persona.id_persona,
        documento_siprun: documentoSiprun,
        // documento_factura: documentoFactura,
        _usuario_creacion: 1
      };
      logger.info('[domicilio.controller][creaDomicilio]', 'domicilio ->', datos.documento_identidad);
      await app.dao.domicilio.crearDomicilio(datos);
      res.status(201).json({
        finalizado: true,
        mensaje: 'Creación del registro exitoso.',
        datos: {}
      });
    } catch (error) {
      if (documentoSiprun) {
        fs.unlinkSync(`${path}${documentoSiprun}`);
      }
      // if (documentoFactura) {
      //   fs.unlinkSync(`${path}${documentoFactura}`);
      // }
      logger.error('[domicilio.controller][creaDomicilio]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  const crearCsv = async (path, rows, fields, idUsuario) => {
    try {
      const opts = {
        fields,
        delimiter: '|',
        quote: ''
      };
      const parser = new Json2csvParser(opts);
      const csv = parser.parse(rows);

      if (!fs.existsSync(path)) {
        fs.mkdirsSync(path);
      }
      const fecha = moment().format('YYYYMMDDhhmmss');
      const nombreArchivo = `solicitudes_${idUsuario}_${fecha}.csv`;
      fs.writeFileSync(`${path}${nombreArchivo}`, csv);
      return `${nombreArchivo}`;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const obtenerSolicitudes = async (req, res) => {
    let doc = null;
    const path = `${_path}/files/domicilio/reporte/`;
    try {
      const gestion = moment().format('YYYY');
      const solicitudes = await app.dao.domicilio.listar(gestion);
      const solicitudesFormateados = solicitudes.map((solicitud) => {
        return {
          nro: solicitud.id_domicilio,
          primer_apellido: solicitud.persona.primer_apellido,
          segundo_apellido: solicitud.persona.segundo_apellido,
          nombres: solicitud.persona.nombres,
          casada_apellido: solicitud.persona.casada_apellido,
          documento_identidad: solicitud.persona.documento_identidad,
          documento_complemento: solicitud.persona.documento_complemento,
          expedido: solicitud.persona.expedido,
          fecha_nacimiento: moment(solicitud.persona.fecha_nacimiento).format('DD/MM/YYYY'),
          cod_departamento: solicitud.pcd_dpa_nuevo.cod_departamento,
          departamento: solicitud.pcd_dpa_nuevo.departamento,
          cod_provincia: solicitud.pcd_dpa_nuevo.cod_provincia,
          provincia: solicitud.pcd_dpa_nuevo.provincia,
          cod_municipio: solicitud.pcd_dpa_nuevo.cod_municipio,
          municipio: solicitud.pcd_dpa_nuevo.municipio,
          direccion: solicitud.direccion,
          ci_solicitante: solicitud.ci_solicitante,
          solicitante: solicitud.solicitante,
          nombre_archivo: solicitud.documento_siprun,
          fecha_solicitud: moment(solicitud._fecha_creacion).format('DD/MM/YYYY')
        };
      });
      if (solicitudesFormateados && solicitudesFormateados.length <= 0) {
        throw new Error('No se cuentan con solicitudes de cambio de municipio para la presente gestión.');
      }
      logger.info('[domicilio.controller][obtenerSolicitudes]', 'length->', solicitudesFormateados.length);
      const fields = ['nro', 'primer_apellido', 'segundo_apellido', 'nombres', 'casada_apellido', 'documento_identidad', 'documento_complemento', 'expedido',
        'fecha_nacimiento', 'cod_departamento', 'departamento', 'cod_provincia', 'provincia', 'cod_municipio', 'municipio', 'direccion', 'ci_solicitante',
        'solicitante', 'nombre_archivo', 'fecha_solicitud'
      ];
      doc = await crearCsv(path, solicitudesFormateados, fields, req.body.audit_usuario.id_usuario);
      logger.info('[domicilio.controller][obtenerSolicitudes]', 'Archivo generado', doc);
      res.set('Content-Type', 'text/csv');
      res.download(`${path}${doc}`);
    } catch (error) {
      if (doc) {
        fs.unlinkSync(`${path}${doc}`);
      }
      logger.error('[domicilio.controller][obtenerSolicitudes]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  _app.controller.domicilio = {
    crearDomicilio,
    obtenerSolicitudes
  };
};
