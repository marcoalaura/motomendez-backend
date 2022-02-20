import logger from '../../../lib/logger';
import moment from 'moment';
import segip from './../../../services/segip/segip';
const fs = require('fs-extra');
const formidable = require('formidable');
const { obtenerArchivo } = require('../../../lib/upload');
const Json2csvParser = require('json2csv').Parser;

module.exports = (app) => {
  const _app = app;

  /**
   * importar - Método para importar datos del csv
   * @param {object} datos
   */
  const importar = async (req, res) => {
    const usuario = req.body.audit_usuario;
    const gestion = moment().add(1, 'year').format('YYYY');
    const tipos = [{ id_rol: 6, tipo: 'SIPRUN' }, { id_rol: 7, tipo: 'IBC' }];

    try {
      const tipo = tipos.find(item => item.id_rol === usuario.id_rol);
      // validar rol
      if (tipo) {
        // obtener archivo
        const form = new formidable.IncomingForm();
        const archivo = await obtenerArchivo(req, form);
        if (archivo) {
          fs.moveSync(archivo.file.path, '/tmp/importar.csv', { overwrite: true });
          const resultado = await _app.dao.tmp_corte_anual.importarRegistros(usuario.id_usuario, gestion, tipo.tipo, 'PENDIENTE');
          logger.info('[tmp_corte_anual.controller][importar]', 'se realizo la importación con exito ->', JSON.stringify(resultado));
          if (resultado[0].importar === 'Ok') {
            res.status(200).json({
              finalizado: true,
              mensaje: 'Importación de datos exitoso.',
              datos: {},
            });
          } else {
            throw new Error(resultado[0].importar);
          }
        } else {
          throw new Error('Debe adjuntar el archivo CSV.');
        }
      } else {
        throw new Error('El usuario no tiene permiso para realizar esta operación.');
      }
    } catch (error) {
      logger.error('[tmp_corte_anual.controller][importar]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const crearCsv = async (path, rows, fields, idUsuario) => {
    try {
      const opts = {
        fields,
        delimiter: '~',
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

  const obtenerEstadoCorteAnual = async (req, res) => {
    try {
      console.log ('req:::::', req.body);

      const gestion = moment().add(1, 'year').format('YYYY');
      const registros = await _app.dao.tmp_corte_anual.estadoCorteAnual(gestion);
      console.log ('REG::::', registros);
      if (!registros) {
        throw new Error('No se cuentan con un proceso de corte anual para la siguiente gestion.');
      }
      // Consulta el estado del corte anual
      let mensaje = '';
      if (registros.length === 0) {
        mensaje = 'PENDIENTE';
      } else if (registros.length > 0) {
        if (registros[0].estado_contrastacion === 'PENDIENTE') {
          mensaje = 'FILTRADO';
        } else {
          mensaje = 'CONTRASTADO';
        }
      }
      res.status(200).json({
        finalizado: true,
        mensaje,
      });
    } catch (error) {
      logger.error('[corte_anual.controller][obtenerEstadoCorteAnual]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
      });
    }
  };

  const obtenerCorteAnual = async (req, res) => {
    let doc = null;
    const path = `${_path}/files/corteanual/reporte/`;
    try {
      console.log ('req:::::', req.body);
      // const gestion = req.body.gestion;
      const gestion = moment().add(1, 'year').format('YYYY');
      const registros = await _app.dao.tmp_corte_anual.listarCorteAnualHabilitados(gestion);
      const registrosFormateados = registros.map((registro) => {
        return {
          nro: registro.nro,
          exp_departamento: registro.exp_departamento,
          nro_documento: registro.nro_documento,
          complemento: registro.complemento,
          exp_pais: registro.exp_pais,
          primer_apellido: registro.primer_apellido,
          segundo_apellido: registro.segundo_apellido,
          apellido_casada: registro.apellido_casada,
          nombres: registro.nombres,
          estado_civil: registro.estado_civil,
          formato_inf: registro.formato_inf,
          fecha_nacimiento: moment(registro.fecha_nacimiento, 'DD/MM/YYYY').format('DD/MM/YYYY'),
          tipo_discapacidad: registro.tipo_discapacidad,
          grado_discapacidad: registro.grados_disc,
          porcentaje: registro.porcentaje,
          fecha_vigencia: moment(registro.fecha_vigencia, 'DD/MM/YYYY').format('DD/MM/YYYY'),
          pais: registro.pais,
          cod_municipio: registro.codigo_municipal,
          nombre_municipio: registro.nombre_municipio,
          direccion: registro.direccion,
          telefono: registro.telefono,
          celular: registro.celular,
          id_entidad: registro.id_entidad,    // Nuevo codigo solicitado por el SIGEP
        };
      });
      if (registrosFormateados && registrosFormateados.length <= 0) {
        throw new Error('No se cuentan con registros filtrados del corte anual de la gestión.');
      }
      logger.info('[corte_anual.controller][obtenerCorteAnual]', 'length->', registrosFormateados.length);
      const fields = ['nro', 'exp_departamento', 'nro_documento', 'complemento', 'exp_pais', 'primer_apellido', 'segundo_apellido',
        'apellido_casada', 'nombres', 'estado_civil', 'formato_inf', 'fecha_nacimiento', 'tipo_discapacidad', 'grado_discapacidad',
        'porcentaje', 'fecha_vigencia', 'pais', 'cod_municipio', 'nombre_municipio', 'direccion', 'telefono', 'celular', , 'id_entidad',
      ];

      doc = await crearCsv(path, registrosFormateados, fields, req.body.audit_usuario.id_usuario);
      logger.info('[corte_anual.controller][obtenerCorteAnual]', 'Archivo generado', doc);
      res.set('Content-Type', 'text/csv');
      res.download(`${path}${doc}`);
    } catch (error) {
      if (doc) {
        fs.unlinkSync(`${path}${doc}`);
      }
      logger.error('[corte_anual.controller][obtenerCorteAnual]', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  const filtrar = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    const gestion = moment().add(1, 'year').format('YYYY');
    const gestionActual = moment().format('YYYY');
    try {
      const tmpCorteAnual = await app.dao.tmp_corte_anual.generarListaHabilitados(usuario, gestion);
      console.log('CORTE_ANUAL::::', tmpCorteAnual);
      logger.info('[tmp_corte_anual.controller][filtrar]', 'mensaje ->', tmpCorteAnual);
      if (tmpCorteAnual.length > 0) {
        if (tmpCorteAnual[0].fn_filtrar_corte_anual === 'Ok') {
          await app.controller.controlCorte.actualizaPasoControlCorte(usuario, gestionActual, null, 'ANUAL', 5, true);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Ok',
            datos: {},
          });
        } else {
          throw new Error(tmpCorteAnual[0].fn_filtrar_corte_anual);
        }
      } else {
        throw new Error(tmpCorteAnual || '');
      }
    } catch (error) {
      logger.error('[tmp_corte_anual.controller][filtrar] %s %j', 'error ->', error.message);
      await app.controller.controlCorte.actualizaPasoControlCorte(usuario, gestionActual, null, 'ANUAL', 5, false);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const contrastarGeneral = async (personaDB, usuario) => {
    const persona = {};

    const datosPersona = {
      NumeroDocumento: personaDB.nro_documento,
      FechaNacimiento: personaDB.fecha_nacimiento,
      Nombres: personaDB.nombres,
      PrimerApellido: personaDB.primer_apellido ? personaDB.primer_apellido : '--',
      SegundoApellido: personaDB.segundo_apellido ? personaDB.segundo_apellido : '--',
      Complemento: personaDB.complemento ? personaDB.complemento : '',
    };

    const verificaSegip = await segip.contrastacion(datosPersona);
    if (verificaSegip) {
      if (verificaSegip.finalizado) {
        persona.estado_contrastacion = 'HABILITADO';
        persona._usuario_modificacion = usuario;
      } else {
        persona.estado_contrastacion = 'OBSERVADO';
        persona.observacion_contrastacion = verificaSegip.datos.substring(0, 100);
        persona._usuario_modificacion = usuario;
      }
    }
    return persona;
  };

  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  const contrastarCorteAnual = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    const gestion = moment().add(1, 'year').format('YYYY');
    try {
      const tmpCorteAnual = await app.dao.tmp_corte_anual.contrastarHabilitados(usuario, gestion);
      if (tmpCorteAnual[0].contrastar === 'Ok') {
        logger.info('[pcd.controller][filtrar]', 'mensaje ->', tmpCorteAnual);
        const pendientes = await app.dao.tmp_corte_anual.obtenerPendienteContrastacion(gestion);
        console.log('pendientes:::', pendientes.length);
        if (pendientes && pendientes.length > 0) {
          for (let i = 0; i < pendientes.length; i++) {
            const respuesta = await contrastarGeneral(pendientes[i], usuario);
            await wait(1000);
            if (respuesta) {
              await app.dao.tmp_corte_anual.actualizar(pendientes[i].id, respuesta);
            }
          }
          res.status(200).json({
            finalizado: true,
            mensaje: 'Contrastación realizado con éxito',
            datos: {},
          });
        } else {
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
      logger.error('[pcd.controller][filtrar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listarCorte = async (req, res) => {
    const gestion = moment().add(1, 'year').format('YYYY');
    const tipoParam = req.query.tipo;
    const estadoParam = req.query.estado;
    const usuario = req.body.audit_usuario;
    try {
      logger.info('[tmp_corte_anual.controller][listarCorte]', 'idRol ->', usuario.id_rol);

      if ([2, 6, 7].includes(usuario.id_rol)) { // MINISTERIO, SIPRUN, IBC
        const query = { gestion };
        if (usuario.id_rol === 2) {
          if (tipoParam) {
            query.tipo = tipoParam;
          }
        } else {
          query.tipo = (usuario.id_rol === 6) ? 'SIPRUN' : 'IBC';
        }
        if (estadoParam) {
          query.estado_contrastacion = estadoParam;
        }

        const datos = await app.dao.tmp_corte_anual.listar(query, req.query);
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
      logger.error('[tmp_corte_anual.controller][listarCorte] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };
  const obtenerRegistro = async (req, res) => {
    try {
      if (req.params.id) {
        const respuesta = await app.dao.tmp_corte_anual.obtenerRegistro({ id: req.params.id });
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
      logger.error('[tmp_corte_anual.controller][obtenerRegistro] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };

  const modificar = async (req, res) => {
    const gestion = moment().add(1, 'year').format('YYYY');
    const usuario = req.body.audit_usuario;
    try {
      if ([6, 7].includes(usuario.id_rol)) { // SIPRUN, IBC
        const where = {
          id: req.params.id,
          tipo: (usuario.id_rol === 6) ? 'SIPRUN' : 'IBC',
          estado_contrastacion: 'OBSERVADO',
          gestion
        };
        const pcd = await app.dao.tmp_corte_anual.obtenerRegistro(where);
        const datosPersona = {
          NumeroDocumento: req.body.nro_documento,
          FechaNacimiento: req.body.fecha_nacimiento,
          Nombres: req.body.nombres,
          PrimerApellido: req.body.primer_apellido ? req.body.primer_apellido : '--',
          SegundoApellido: req.body.segundo_apellido ? req.body.segundo_apellido : '--',
          Complemento: req.body.complemento ? req.body.complemento : '',
        };

        if (pcd) {
          const verificaSegip = await segip.contrastacion(datosPersona);
          // console.log('-------------------------------verificaSegip', verificaSegip);

          if (verificaSegip.finalizado) {
            const persona = {
              nro_documento: req.body.nro_documento,
              fecha_nacimiento: req.body.fecha_nacimiento,
              nombres: req.body.nombres.toUpperCase(),
              primer_apellido: req.body.primer_apellido ? req.body.primer_apellido.toUpperCase() : null,
              segundo_apellido: req.body.segundo_apellido ? req.body.segundo_apellido.toUpperCase() : null,
              complemento: req.body.complemento ? req.body.complemento.toUpperCase() : null,
              apellido_casada: req.body.apellido_casada ? req.body.apellido_casada.toUpperCase() : null,
              estado_civil: req.body.estado_civil,
              formato_inf: req.body.formato_inf,
              exp_pais: req.body.exp_pais,
              exp_departamento: req.body.exp_departamento,
              celular: req.body.celular,
              estado_contrastacion: 'HABILITADO',
              observacion_contrastacion: null,
              _usuario_modificacion: usuario.id_usuario,
            };
            await app.dao.tmp_corte_anual.actualizar(req.params.id, persona);
            res.status(200).json({
              finalizado: true,
              mensaje: 'Datos personales actualizados exitosamente.',
              datos: {},
            });
          } else {
            // throw new Error('No se pudo modificar los datos de la personas.');
            throw new Error(`SEGIP: ${verificaSegip.mensaje}. <br>${verificaSegip.datos}`);
          }
        } else {
          throw new Error('No existe el registro o no puede ser modificado.');
        }
      } else {
        throw new Error('El usuario no tiene autorizacción para acceder al recurso.');
      }
    } catch (error) {
      logger.error('[tmp_corte_anual.controller][modificar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {}
      });
    }
  };
  const cargarTmpCorteAnual = async (req, res) => {
    const usuario = req.body.audit_usuario.id_usuario;
    const gestion = moment().format('YYYY');
    const gestionSig = moment().add(1, 'year').format('YYYY');
    try {
      const tmpCorteAnual = await app.dao.tmp_corte_anual.cargarTmpCorteAnual(usuario, gestionSig);
      if (tmpCorteAnual[0].cargar === 'Ok') {
        // Cuando finaliza el proceso actualizamos el estado del control corte
        await app.controller.controlCorte.actualizaPasoControlCorte(usuario, gestion, null, 'ANUAL', 4, true);

        logger.info('[pcd.controller][filtrar]', 'mensaje ->', tmpCorteAnual);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Carga realizada con éxito',
          datos: {},
        });
      } else {
        throw new Error(tmpCorteAnual[0].cargar);
      }
    } catch (error) {
      // Cuando finaliza el proceso actualizamos el estado del control corte
      await app.controller.controlCorte.actualizaPasoControlCorte(usuario, gestion, null, 'ANUAL', 4, false);

      logger.error('[pcd.controller][filtrar] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.tmp_corte_anual = {
    importar,
    listarCorte,
    obtenerEstadoCorteAnual,
    obtenerCorteAnual,
    filtrar,
    contrastarCorteAnual,
    obtenerRegistro,
    modificar,
    cargarTmpCorteAnual,
  };
};
