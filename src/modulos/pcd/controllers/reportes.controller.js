/* eslint no-unused-vars: ['error', { 'argsIgnorePattern': '^_' }] */

import fs from 'fs-extra';
// import request from 'request';
import crypto from 'crypto';
import moment from 'moment';
import pdf from 'html-pdf';
import ejs from 'ejs';
import logger from './../../../lib/logger';

module.exports = (app) => {
  const _app = app;

  /**
   * generarPlantilla - Método para generar la plantilla HTML
   * @param {object} plantilla
   * @param {object} datos
   */
  const generarPlantilla = async (plantilla, datos) => {
    return new Promise((resolve, reject) => {
      ejs.renderFile(plantilla, datos, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          logger.info('[reportes.controller][generarPlantilla] %s %s %j', 'generando plantilla', 'error ->', error);
          reject(error);
        }
      });
    });
  };

  /**
   * crearPdf - Método para crear fisicamente el pdf
   * @param {object} plantilla
   * @param {object} datos
   * @param {string} rutaDocumento
   */
  const crearPdf = async (plantilla, datos, rutaDocumento, header, footer) => {
    const opciones = {
      filename: rutaDocumento,
      format: 'Letter',
      orientation: 'portrait',
      border: {
        top: '0.5cm',
        left: '2cm',
        right: '1.5cm',
        bottom: '1.5cm',
      },
      header,
      footer,
      timeout: '90000',
    };
    return new Promise((resolve, reject) => {
      pdf.create(plantilla, opciones).toFile((errorGen, bufferGen) => {
        if (!errorGen) {
          resolve(bufferGen);
        } else {
          logger.error('[reportes.controller][creaPdf] %s %s %j', 'creando pdf', 'error ->', errorGen);
          reject(errorGen);
        }
      });
    });
  };

  /**
   * crearHashPDF - Metodo para obtener el hash de un documento pdf
   * @param {object} bufferPDF
   */
  const crearHashPdf = async (bufferPDF) => {
    logger.info('[reportes.controller][crearHashPdf]', 'creando hash', 'nombre ->', bufferPDF.filename);
    const pdfBuffer = fs.readFileSync(bufferPDF.filename);
    const base64 = new Buffer(pdfBuffer).toString('base64');
    const hash = crypto.createHash('sha1').update(base64).digest('hex');
    logger.info('[reportes.controller][crearHashPdf]', 'hash', 'hash ->', hash);
    return hash;
  };

  /**
   * generarReportePOrMunicipio - Método para generar un reporte por municipio
   * @param {string} codMunicipio
   * @param {object} datosDpa
   * @param {object} datosPcds
   * @param {number} gestion
   * @param {object} mes
   */
  const generarReportePorMunicipio = async (codMunicipio, datosDpa, datosPcds, gestion, mes) => {
    const plantilla = 'src/templates/reporte.html';
    let certificado = '';
    let nombreReporte = '';
    try {
      const dir = `${_path}`;
      certificado = `/files/REPORTES_MENSUALES/${gestion}/${mes.id_mes}`;
      if (!fs.existsSync(dir + certificado)) {
        fs.mkdirsSync(dir + certificado);
      }
      const fecha = moment().format('YYYYMMDDhhmmss');
      nombreReporte = `${datosDpa.cod_municipio}_${datosDpa.municipio}_${fecha}.pdf`;
      const rutaReporte = `${dir}${certificado}/${nombreReporte}`;
      const datos = {
        departamento: datosDpa.departamento,
        provincia: datosDpa.provincia,
        municipio: datosDpa.municipio.toUpperCase(),
        gestion,
        mes: mes.mes,
        personas: datosPcds,
        fecha: moment(`20/${mes.mes}/${gestion}`, 'DD/MM/YYYY').format('DD/MM/YYYY'),
      };
      const plantillaHtml = await generarPlantilla(plantilla, datos);
      if (plantillaHtml) {
        logger.info('[reportes.controller][generarReportesPOrMunicipio]', 'generado de plantilla con exito ->', 'cod_municipio ->', codMunicipio);
        const header = {
          height: '2.5cm',
          contents: `<table><tr>
                        <td width="330px" style="font-size: 10px;"><strong>DEPARTAMENTO: </strong>${datos.departamento}<br><strong>PROVINCIA: </strong>
                          ${datos.provincia}<br><strong>GESTIÓN: </strong>${datos.mes}/${datos.gestion}</td>
                        <td width=150 style="text-align:center;font-size: 8px;"><strong>FECHA DE ELABORACIÓN</strong><br>${datos.fecha}</td>
                     </tr></table>
                     <hr size="2" width="480" noshade>`,
        };
        const footer = {
          height: '0.5cm',
          contents: `<hr size="2" width="480" noshade>
                      <table style="font-size: 9px;"><tr><td width="400px"><p>MUNICIPIO DE
                      ${datos.municipio.toUpperCase()} </p></td><td width="80px" align="right">{{page}}/{{pages}}</td></tr></table>`,
        };
        const pdfCreado = await crearPdf(plantillaHtml, datos, rutaReporte, header, footer);
        if (pdfCreado) {
          logger.info('[reportes.controller][generarReportesPOrMunicipio]', 'pdf creado con exito', 'cod_municipio ->', codMunicipio);
          const hash = await crearHashPdf(pdfCreado);
          if (hash) {
            logger.info('[reportes.controller][generarReportesPOrMunicipio]', 'hash generado con exito', 'cod_municipio ->', codMunicipio);
            const datosReporteMensual = {
              ruta_documento: `${certificado}/${nombreReporte}`,
              hash,
              observacion: 'Generado con exito',
              estado: 'GENERADO',
              _fecha_creacion: new Date(),
              fid_mes: mes.id_mes,
              fid_municipio: datosDpa.cod_municipio,
            };
            const registro = await app.dao.reporte.crearRegistro(datosReporteMensual);
            if (!registro) {
              logger.info('[reportes.controller][generarReportesPOrMunicipio]', 'registro creado con exito', 'cod_municipio ->', codMunicipio);
              throw new Error('Error al crear el registro');
            } else {
              return true;
            }
          } else {
            throw new Error('Error al generar el hash');
          }
        } else {
          throw new Error('Error al crear el pdf.');
        }
      } else {
        throw new Error('Error al generar la plantilla HTML.');
      }
    } catch (error) {
      const datosReporteMensual = {
        ruta_documento: `${certificado}/${nombreReporte}`,
        hash: '',
        observacion: error.message,
        estado: 'PENDIENTE',
        _fecha_creacion: new Date(),
        fid_mes: mes.id_mes,
        fid_municipio: datosDpa.cod_municipio,
      };
      await app.dao.reporte.crearRegistro(datosReporteMensual);
      logger.error('[reportes.controller][generarReportesPOrMunicipio]', 'error ->', error.message);
      return (error.message);
    }
  };

  const generarReportesMunicipio = async (gestion, mes2) => {
    try {
      logger.info('[reportes.controller][generarReportesMunicipio]', 'generar reportes para ->', gestion);
      const estado = 'REGISTRADO_SIGEP';
      const municipios = await app.dao.reporte.obtenerMunicipiosCorteMensual(gestion, estado);
      const mes = await app.dao.gestion.obtenerMesByGestionMes(gestion, mes2);
      for (let municipio of municipios) {
        const datosDpa = await app.dao.reporte.obtenerDatosMunicipio(municipio.cod_municipio);
        logger.info('[reportes.controller][generarReportesMunicipio]', 'generar reporte para cod_municipio->', municipio.cod_municipio);
        const datosPcds = await app.dao.reporte.obtenerPcdsPorMunicipioCorteMensual(municipio.cod_municipio, gestion, mes.id_mes);
        const datosPcdsFormateados = datosPcds.map((elemento) => {
          const formateados = {};
          let nombreCompletoRegla = null;
          if (elemento.formato_inf === 'NUAC') {
            nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} ${elemento.nombres}`;
          } else {
            // Observacion encontrada cuando el primer apellido es vacio, se debe utilizar el segundo a pellido
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
          }
          let conComplemento = elemento.c_i;
          if (elemento.complemento_documento){
            conComplemento = `${elemento.c_i} - ${elemento.complemento_documento}`;
          }
          formateados['max'] = elemento.max;
          formateados['c_i'] = conComplemento;
          formateados['nombre_completo'] = nombreCompletoRegla;
          formateados['telefono'] = elemento.telefono;
          formateados['id_pcd'] = elemento.id_pcd;
          return formateados;
        });
        await generarReportePorMunicipio(municipio.cod_municipio, datosDpa, datosPcdsFormateados, gestion, mes); // TODO: verificar el idMes
      }
      return true;
    } catch (error) {
      logger.error('[reportes.controller][generarReportesMunicipio]', 'error ->', error.message);
      return false;
    }
  };

  const regenerarReportesMunicipio = async (gestion, idMes, municipios) => {
    try {
      logger.info('[reportes.controller][generarReportesMunicipio]', 'generar reportes para ->', gestion);
      const mes = await app.dao.gestion.obtenerMes(idMes);
      for (let municipio of municipios) {
        const datosDpa = await app.dao.reporte.obtenerDatosMunicipio(municipio);
        logger.info('[reportes.controller][generarReportesMunicipio]', 'generar reporte para cod_municipio->', municipio);
        const datosPcds = await app.dao.reporte.obtenerPcdsPorMunicipioCorteMensual(municipio, gestion, idMes);
        const datosPcdsFormateados = datosPcds.map((elemento) => {
          const formateados = {};
          let nombreCompletoRegla = null;
          if (elemento.formato_inf === 'NUAC') {
            nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} ${elemento.nombres}`;
          } else {
            // Observacion encontrada cuando el primer apellido es vacio, se debe utilizar el segundo a pellido
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
          }
          let conComplemento = elemento.c_i;
          if (elemento.complemento_documento){
            conComplemento = `${elemento.c_i} - ${elemento.complemento_documento}`;
          }
          formateados['max'] = elemento.max;
          formateados['c_i'] = conComplemento;
          formateados['nombre_completo'] = nombreCompletoRegla;
          formateados['telefono'] = elemento.telefono;
          formateados['id_pcd'] = elemento.id_pcd;
          return formateados;
        });
        await generarReportePorMunicipio(municipio, datosDpa, datosPcdsFormateados, gestion, mes); // TODO: verificar el idMes
      }
      return true;
    } catch (error) {
      logger.error('[reportes.controller][generarReportesMunicipio]', 'error ->', error.message);
      return false;
    }
  };

  const obtenerReporte = async (req, res) => {
    try {
      const reporte = await app.dao.reporte.obtenerReporteMensual(req.params.id_reporte_mensual);
      if (reporte && reporte.estado === 'GENERADO') {
        const pdfBuffer = fs.readFileSync(`${_path}/${reporte.ruta_documento}`);
        res.status(200).send(pdfBuffer);
      } else {
        throw new Error('No existe el registro solicitado.');
      }
    } catch (error) {
      logger.error('[reportes.controller][obtenerReporte]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerReporteRegularizado = async (req, res) => {
    try {
      const reporte = await app.dao.reporte.obtenerReporteMensualRegularizado(req.params.id_reporte_mensual);
      if (reporte && reporte.estado === 'GENERADO') {
        const pdfBuffer = fs.readFileSync(`${_path}/${reporte.ruta_documento}`);
        res.status(200).send(pdfBuffer);
      } else {
        throw new Error('No existe el registro solicitado.');
      }
    } catch (error) {
      logger.error('[reportes.controller][obtenerReporteRegularizado]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerReporteAcumulado = async (req, res) => {
    try {
      console.log('Parametros recibidos::::::::::', req.params);
      const reporte = await app.dao.reporte.obtenerReporteMensualAcumulado(req.params.id);
      if (reporte && reporte.estado === 'GENERADO') {
        const pdfBuffer = fs.readFileSync(`${_path}/${reporte.ruta_documento}`);
        res.status(200).send(pdfBuffer);
      } else {
        throw new Error('No existe el registro solicitado.');
      }
    } catch (error) {
      logger.error('[reportes.controller][obtenerReporteAcumulado]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerReporteAnual = async (req, res) => {
    try {
      const reporte = await app.dao.reporte.obtenerReporteAnual(req.params.id_reporte_anual);
      const pdfBuffer = fs.readFileSync(`${_path}/${reporte.ruta_documento}`);
      if (pdfBuffer) {
        res.status(200).send(pdfBuffer);
      } else {
        throw new Error('No existe el registro solicitado.');
      }
    } catch (error) {
      logger.error('[reportes.controller][obtenerReporteAnual]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const generarDatosReporteAnual = async (municipios, gestion) => {
    const datos = [];
    await Promise.all(municipios.map(async (municipio) => {
      logger.info('[reportes.controller][generarDatosReporteAnual]', 'obteniendo datos para ->', municipio.cod_municipio);
      const datosDpa = await app.dao.reporte.obtenerDatosMunicipio(municipio.cod_municipio);
      logger.info('[reportes.controller][generarDatosReporteAnual]', 'obteniendo pcds para ->', gestion);
      const datosPcds = await app.dao.reporte.obtenerPcdsPorMunicipioCorteAnual(municipio.cod_municipio, gestion);
      datos.push({
        municipio: datosDpa.municipio,
        personas: datosPcds,
      });
    }));
    logger.info('[reportes.controller][generarDatosReporteAnual] %s %d', 'resultados para el municipio ->', datos.length);
    return datos;
  };

  const generarReporteAnualTotal = async (gestion) => {
    const plantilla = 'src/templates/reporte_anual.html';
    try {
      const dir = `${_path}`;
      const certificado = `/files/REPORTES_ANUALES/`;
      if (!fs.existsSync(dir + certificado)) {
        fs.mkdirsSync(dir + certificado);
      }
      const fecha = moment().format('YYYYMMDDhhmmss');
      const nombreReporte = `${gestion}_${fecha}.pdf`;
      const rutaReporte = `${dir}${certificado}/${nombreReporte}`;
      const municipios = await app.dao.reporte.obtenerMunicipiosCorteAnual(gestion);
      const datosMunicipios = await generarDatosReporteAnual(municipios, gestion);
      console.log('\n\n');
      const datos = {
        municipios: datosMunicipios,
        gestion,
        fecha: moment().format('DD/MM/YYYY'),
      };
      const plantillaHtml = await generarPlantilla(plantilla, datos);
      if (plantillaHtml) {
        logger.info('[reportes.controller][generarReporteAnualTotal]', 'se genero la plantillaHTMl con exito');
        const header = {
          height: '2.5cm',
          contents: `<table><tr>
                        <td width="330px" style="font-size: 10px;"><strong>GESTIÓN: </strong>${gestion}</td>
                        <td width=150 style="text-align:center;font-size: 8px;"><strong>FECHA DE ELABORACIÓN</strong><br>${datos.fecha}</td>
                        </tr>
                        <tr><td colspan="2" style="text-align:center;font-size: 11px;"><strong>CORTE ANUAL</strong></td></tr>
                        </table>
                     <hr size="2" width="480" noshade>`,
        };
        const footer = {
          height: '0.5cm',
          contents: `<hr size="2" width="480" noshade>
                      <table style="font-size: 9px;"><tr><td width="400px"><p>Ministerio de Trabajo, Empleo y Previsión Social
                      </p></td><td width="80px" align="right">{{page}}/{{pages}}</td></tr></table>`,
        };
        const pdfCreado = await crearPdf(plantillaHtml, datos, rutaReporte, header, footer);
        if (!pdfCreado) {
          throw new Error('Error al crear el pdf.');
        } else {
          logger.info('[reportes.controller][generarReporteAnualTotal]', 'se creo el pdf con exito');
          const hash = await crearHashPdf(pdfCreado);
          if (hash) {
            logger.info('[reportes.controller][generarReporteAnualTotal]', 'hash generado con exito', 'hash ->', hash);
            const datosReporteAnual = {
              ruta_documento: `${certificado}${nombreReporte}`,
              hash,
              observacion: 'Archivo generado con exito',
            };
            const registro = await app.dao.gestion.actualizarGestion(gestion, datosReporteAnual);
            if (!registro) {
              logger.info('[reportes.controller][generarReporteAnualTotal]', 'gestion actualizada con exito', 'registro ->', registro);
              throw new Error('Error al crear el gestion');
            } else {
              return true;
            }
          } else {
            throw new Error('Error al generar el hash');
          }
          // return true;
        }
      } else {
        throw new Error('Error al generar la plantilla HTML.');
      }
    } catch (error) {
      logger.error('[reportes.controller][generarReporteAnualTotal]', 'error ->', error.message);
      return (error.message);
    }
  };

  /**
   * generarReportePorMunicipioRegularizado - Método para generar un reporte por municipio con datos de beneficiarios regularizados
   * @param {string} codMunicipio
   * @param {object} datosDpa
   * @param {object} datosPcds
   * @param {number} gestion
   * @param {object} mes
   */
  const generarReportePorMunicipioRegularizado = async (codMunicipio, datosDpa, datosPcds, gestion, mes) => {
    const plantilla = 'src/templates/reporteRegularizado.html';
    let certificado = '';
    let nombreReporte = '';
    try {
      const dir = `${_path}`;
      certificado = `/files/REPORTES_MENSUALES_REG/${gestion}/${parseInt(mes)}`;
      if (!fs.existsSync(dir + certificado)) {
        fs.mkdirsSync(dir + certificado);
      }
      const fecha = moment().format('YYYYMMDDhhmmss');
      nombreReporte = `${datosDpa.cod_municipio}_${datosDpa.municipio}_${fecha}-REGULARIZADOS.pdf`;
      const rutaReporte = `${dir}${certificado}/${nombreReporte}`;
      const datos = {
        departamento: datosDpa.departamento,
        provincia: datosDpa.provincia,
        municipio: datosDpa.municipio.toUpperCase(),
        gestion,
        mes,
        personas: datosPcds,
        fecha: moment(`19/${mes}/${gestion}`, 'DD/MM/YYYY').format('DD/MM/YYYY'),
      };
      const plantillaHtml = await generarPlantilla(plantilla, datos);
      console.log('============ PLANTILLA ====');
      console.log(plantillaHtml);
      console.log('==========================================');
      if (plantillaHtml) {
        logger.info('[reportes.controller][generarReportesPorMunicipioRegularizado]', 'generado de plantilla con exito ->', 'cod_municipio ->', codMunicipio);
        const header = {
          height: '2.5cm',
          contents: `<table><tr>
                        <td width="330px" style="font-size: 10px;"><strong>DEPARTAMENTO: </strong>${datos.departamento}<br><strong>PROVINCIA: </strong>
                          ${datos.provincia}<br><strong>GESTIÓN: </strong>${datos.gestion}</td>
                        <td width=150 style="text-align:center;font-size: 8px;"><strong>FECHA DE ELABORACIÓN</strong><br>${datos.fecha}</td>
                     </tr></table>
                     <hr size="2" width="480" noshade>`,
        };
        const footer = {
          height: '0.5cm',
          contents: `<hr size="2" width="480" noshade>
                      <table style="font-size: 9px;"><tr><td width="400px"><p>MUNICIPIO DE
                      ${datos.municipio.toUpperCase()} </p></td><td width="80px" align="right">{{page}}/{{pages}}</td></tr></table>`,
        };
        const pdfCreado = await crearPdf(plantillaHtml, datos, rutaReporte, header, footer);
        if (pdfCreado) {
          logger.info('[reportes.controller][generarReportesPorMunicipioRegularizado]', 'pdf creado con exito', 'cod_municipio ->', codMunicipio);
          const hash = await crearHashPdf(pdfCreado);
          if (hash) {
            logger.info('[reportes.controller][generarReportesPorMunicipioRegularizado]', 'hash generado con exito', 'cod_municipio ->', codMunicipio);
            const datosReporteRetroactivo = {
              ruta_documento: `${certificado}/${nombreReporte}`,
              hash,
              observacion: 'Generado con exito',
              estado: 'GENERADO',
              _fecha_creacion: new Date(),
              mes: parseInt(mes),
              cod_municipio: datosDpa.cod_municipio,
              fid_gestion: parseInt(gestion),
            };
            const registro = await app.dao.reporte.crearRegistroRetroactivo(datosReporteRetroactivo);
            if (!registro) {
              logger.info('[reportes.controller][generarReportesPorMunicipioRegularizado]', 'registro creado con exito', 'cod_municipio ->', codMunicipio);
              throw new Error('Error al crear el registro');
            } else {
              return true;
            }
          } else {
            throw new Error('Error al generar el hash');
          }
        } else {
          throw new Error('Error al crear el pdf.');
        }
      } else {
        throw new Error('Error al generar la plantilla HTML.');
      }
    } catch (error) {
      const datosReporteRetroactivo = {
        ruta_documento: `${certificado}/${nombreReporte}`,
        hash: '',
        observacion: error.message,
        estado: 'PENDIENTE',
        _fecha_creacion: new Date(),
        mes: parseInt(mes),
        cod_municipio: datosDpa.cod_municipio,
        fid_gestion: parseInt(gestion),
      };
      await app.dao.reporte.crearRegistroRetroactivo(datosReporteRetroactivo);
      logger.error('[reportes.controller][generarReportesPorMunicipioRegularizado]', 'error ->', error.message);
      return (error.message);
    }
  };

  const generarReportesMunicipioRegularizados = async (fechaInicio, fechaFin) => {
    try {
      logger.info('[reportes.controller][generarReportesMunicipioRegularizados]', 'generar reportes hasta ->', fechaFin);
      const estado = 'REGISTRADO_SIGEP';
      const municipios = await app.dao.reporte.obtenerMunicipiosRegularizados(fechaInicio, fechaFin, estado);
      for (let municipio of municipios) {
        const datosDpa = await app.dao.reporte.obtenerDatosMunicipio(municipio.cod_municipio);
        logger.info('[reportes.controller][generarReportesMunicipioRegularizados]', 'generar reporte para cod_municipio->', municipio.cod_municipio);
        const datosPcds = await app.dao.reporte.obtenerPcdsPorMunicipioCortesMensualesRegularizados(municipio.cod_municipio, fechaInicio, fechaFin);
        const datosPcdsFormateados = datosPcds.map((elemento) => {
          const formateados = {};
          let nombreCompletoRegla = null;
          if (elemento.formato_inf === 'NUAC') {
            nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} ${elemento.nombres}`;
          } else {
            // Observacion encontrada cuando el primer apellido es vacio, se debe utilizar el segundo a pellido
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
          }
          let conComplemento = elemento.c_i;
          if (elemento.complemento_documento) {
            conComplemento = `${elemento.c_i} - ${elemento.complemento_documento}`;
          }
          formateados['c_i'] = conComplemento;
          formateados['nombre_completo'] = nombreCompletoRegla;
          formateados['telefono'] = elemento.telefono;
          formateados['id_pcd'] = elemento.id_pcd;
          formateados['fid_mes'] = elemento.fid_mes;
          return formateados;
        });
        const arrayFechaIni = fechaInicio.split('-');
        const gestion = arrayFechaIni[0];
        const arrayFechaFin = fechaFin.split('-');
        const mes = arrayFechaFin[1];
        await generarReportePorMunicipioRegularizado(municipio.cod_municipio, datosDpa, datosPcdsFormateados, gestion, mes); // TODO: verificar el idMes
      }
      return true;
    } catch (error) {
      logger.error('[reportes.controller][generarReportesMunicipio]', 'error ->', error.message);
      return false;
    }
  };

  /**
   * generarReportePorMunicipioAcumulado - Método para generar un reporte por municipio con datos acumulados
   * @param {object} datosDpa
   * @param {object} datosPcds
   * @param {number} gestion
   * @param {object} mes
   */
  const generarReportePorMunicipioAcumulado = async (datosDpa, datosPcds, gestion, mes) => {
    const plantilla = 'src/templates/reporteAcumulado.html';
    let certificado = '';
    let nombreReporte = '';
    try {
      const dir = `${_path}`;
      certificado = `/files/REPORTES_MENSUALES_ACUM/${gestion}/${parseInt(mes)}`;
      if (!fs.existsSync(dir + certificado)) {
        fs.mkdirsSync(dir + certificado);
      }
      const fecha = moment().format('YYYYMMDDhhmmss');
      nombreReporte = `${datosDpa.cod_municipio}_${datosDpa.municipio}_${fecha}-ACUMULADO.pdf`;
      const rutaReporte = `${dir}${certificado}/${nombreReporte}`;
      const datos = {
        departamento: datosDpa.departamento,
        provincia: datosDpa.provincia,
        municipio: datosDpa.municipio.toUpperCase(),
        gestion,
        mes,
        personas: datosPcds,
        fecha: moment(`20/${mes}/${gestion}`, 'DD/MM/YYYY').format('DD/MM/YYYY'),
      };
      const plantillaHtml = await generarPlantilla(plantilla, datos);
      if (plantillaHtml) {
        logger.info('[reportes.controller][generarReportePorMunicipioAcumulado]', 'generado de plantilla con exito ->', 'cod_municipio ->', datosDpa.cod_municipio);
        const header = {
          height: '2.5cm',
          contents: `<table><tr>
                        <td width="330px" style="font-size: 10px;"><strong>DEPARTAMENTO: </strong>${datos.departamento}<br><strong>PROVINCIA: </strong>
                          ${datos.provincia}<br><strong>GESTIÓN: </strong>${datos.gestion}</td>
                        <td width=150 style="text-align:center;font-size: 8px;"><strong>FECHA DE ELABORACIÓN</strong><br>${datos.fecha}</td>
                     </tr></table>
                     <hr size="2" width="480" noshade>`,
        };
        const footer = {
          height: '0.5cm',
          contents: `<hr size="2" width="480" noshade>
                      <table style="font-size: 9px;"><tr><td width="400px"><p>MUNICIPIO DE
                      ${datos.municipio.toUpperCase()} </p></td><td width="80px" align="right">{{page}}/{{pages}}</td></tr></table>`,
        };
        const pdfCreado = await crearPdf(plantillaHtml, datos, rutaReporte, header, footer);
        if (pdfCreado) {
          logger.info('[reportes.controller][generarReportePorMunicipioAcumulado]', 'pdf creado con exito', 'cod_municipio ->', datosDpa.cod_municipio);
          const hash = await crearHashPdf(pdfCreado);
          if (hash) {
            logger.info('[reportes.controller][generarReportePorMunicipioAcumulado]', 'hash generado con exito', 'cod_municipio ->', datosDpa.cod_municipio);
            const datosReporteAcumulado = {
              ruta_documento: `${certificado}/${nombreReporte}`,
              hash,
              observacion: 'Generado con exito',
              estado: 'GENERADO',
              _fecha_creacion: new Date(),
              mes: parseInt(mes),
              cod_municipio: datosDpa.cod_municipio,
              fid_gestion: parseInt(gestion),
            };
            const registro = await app.dao.reporte.crearRegistroAcumulado(datosReporteAcumulado);
            if (!registro) {
              logger.info('[reportes.controller][generarReportePorMunicipioAcumulado]', 'registro creado con exito', 'cod_municipio ->', datosDpa.cod_municipio);
              throw new Error('Error al crear el registro');
            } else {
              return true;
            }
          } else {
            throw new Error('Error al generar el hash');
          }
        } else {
          throw new Error('Error al crear el pdf.');
        }
      } else {
        throw new Error('Error al generar la plantilla HTML.');
      }
    } catch (error) {
      const datosReporteAcumulado = {
        ruta_documento: `${certificado}/${nombreReporte}`,
        hash: '',
        observacion: error.message,
        estado: 'PENDIENTE',
        _fecha_creacion: new Date(),
        mes: parseInt(mes),
        cod_municipio: datosDpa.cod_municipio,
        fid_gestion: parseInt(gestion),
      };
      await app.dao.reporte.crearRegistroAcumulado(datosReporteAcumulado);
      logger.error('[reportes.controller][generarReportePorMunicipioAcumulado]', 'error ->', error.message);
      return (error.message);
    }
  };

  const generarReportesMunicipioAcumulado = async (gestion, mes, idUsuario) => {
    try {
      logger.info('[reportes.controller][generarReportesMunicipioAcumulado]', 'generar reportes ->', gestion);
      const estado = 'REGISTRADO_SIGEP';
      const municipios = await app.dao.reporte.obtenerMunicipiosCorteMensual(gestion, estado);
      for (let municipio of municipios) {
        const datosDpa = await app.dao.reporte.obtenerDatosMunicipio(municipio.cod_municipio);
        logger.info('[reportes.controller][generarReportesMunicipioAcumulado]', 'generar reporte para cod_municipio->', municipio.cod_municipio);
        const datosPcds = await app.dao.reporte.obtenerPcdsPorMunicipioCortesMensualesAcumulado(municipio.cod_municipio, gestion, idUsuario);

        let datosPcdsFormateados = [];
        for (let i = 0; i < datosPcds.length; i++) {
          let elemento = datosPcds[i];
          // console.log('elemento>>', elemento);
          const formateados = {};
          let nombreCompletoRegla = null;
          if (elemento.formato_inf === 'NUAC') {
            nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} ${elemento.nombres}`;
          } else {
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'U1AC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || elemento.segundo_apellido} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'C') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
            if (elemento.formato_inf === 'UTAC' && elemento.estado_civil === 'V') {
              nombreCompletoRegla = `${elemento.primer_apellido || ''} ${elemento.segundo_apellido || ''} Vda. de ${elemento.casada_apellido} ${elemento.nombres}`;
            }
          }
          let conComplemento = elemento.c_i;
          if (elemento.complemento_documento) {
            conComplemento = `${elemento.c_i} - ${elemento.complemento_documento}`;
          }

          let meses = {};
          for (let mes in elemento.meses) {
            const id_mes = mes.split('_')[1];
            const esRetroactivo = await app.dao.reporte.registroEsRetroactivo(elemento.c_i, id_mes, gestion);
            //let esRetroactivo = await app.dao.reporte.registroEsRetroactivo(elemento.c_i, mes, gestion);
            meses[`${mes}`] = { habilitado: elemento.meses[mes], retroactivo: esRetroactivo };
          }

          // console.log(`comprobacion :::: ci: ${elemento.c_i}, retroactivo: ${esRetroactivo}`);

          
          formateados['c_i'] = conComplemento;
          formateados['nombre_completo'] = nombreCompletoRegla;
          formateados['telefono'] = elemento.telefono;
          formateados['id_pcd'] = elemento.id_pcd;
          formateados['fid_mes'] = elemento.fid_mes;
          formateados['meses'] = elemento.meses;
          // formateados['meses'] = elemento.meses;
          formateados['meses'] = meses;
          datosPcdsFormateados.push(formateados);
        }
        await generarReportePorMunicipioAcumulado(datosDpa, datosPcdsFormateados, gestion, mes);
      }
      return true;
    } catch (error) {
      console.log('>>>>>>>', error);
      logger.error('[reportes.controller][generarReportesMunicipio]', 'error ->', error.message);
      return false;
    }
  };

  _app.controller.reporte = {
    generarReportesMunicipio,
    obtenerReporte,
    generarReporteAnualTotal,
    obtenerReporteAnual,
    generarReportesMunicipioRegularizados,
    regenerarReportesMunicipio,
    obtenerReporteRegularizado,
    generarReportesMunicipioAcumulado,
    obtenerReporteAcumulado,
  };
};
