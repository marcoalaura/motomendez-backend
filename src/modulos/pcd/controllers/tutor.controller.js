/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import moment from 'moment';
import logger from './../../../lib/logger';
import util from './../../../lib/util';

const fs = require('fs-extra');

module.exports = (app) => {
  const _app = app;

  const crearDocumento = async (dataBase64, idPersona, idPcd) => {
    try {
      // leemos el base 64
      const array = dataBase64.split(',');
      if (array[0] !== 'data:application/pdf;base64' && array[0] !== 'data:image/png;base64' && array[0] !== 'data:image/jpg;base64') {
        throw new Error('El archivo adjunto no tiene el formato esperado. Por favor, intente subir un archivo del tipo PDF. ');
      }
      const buffer = new Buffer(array[1], 'base64');
      const dirPath = `${_path}`;
      const dirFiles = `${dirPath}/files`;
      if (!fs.existsSync(dirFiles)) {
        fs.mkdirsSync(dirFiles);
      }
      const dir = `${dirFiles}/pcds/`;
      const dirPcd = `${dir}${idPcd}/`;
      if (!fs.existsSync(dirPcd)) {
        fs.mkdirsSync(dirPcd);
      }
      const dirTutoresPcd = `${dirPcd}tutores/`;
      if (!fs.existsSync(dirTutoresPcd)) {
        fs.mkdirsSync(dirTutoresPcd);
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
      const nombreArchivo = `${idPersona}_${fecha}.${extension}`;
      fs.writeFileSync(`${dirTutoresPcd}${nombreArchivo}`, buffer);
      return `${dirTutoresPcd}${nombreArchivo}`;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const crearTutor = async (req, res) => {
    let datosArchivo = null;
    try {
      const transaccion = await app.dao.common.crearTransaccion(async (_t) => {
        const idPcd = req.params.id_pcd;
        const idPersona = req.params.id_persona;
        const usuarioAuditoria = req.body.audit_usuario.id_usuario;
        logger.info('[tutor.controller][creaTutor]', 'buscando pcd ->', idPcd);
        const verificaPcd = await app.dao.pcd.buscarPcdPorId(idPcd);
        if (verificaPcd.fid_persona !== idPersona) {
          const tutor = await app.dao.tutor.obtenerTutores(idPcd);
          datosArchivo = await crearDocumento(req.body.documento_ruta, idPersona, idPcd);
          const datosTutor = {
            estado: 'ACTIVO',
            _usuario_creacion: usuarioAuditoria,
            fid_pcd: idPcd,
            fid_persona: idPersona,
            documento_descripcion: req.body.documento_descripcion,
            documento_ruta: datosArchivo,
            fid_parametro: req.body.fid_parametro,
          };
          const datosPersona = {
            sexo: req.body.sexo,
            telefono: req.body.telefono,
            _usuario_modificacion: usuarioAuditoria,
          };
          // si tiene Tutores -> se actualiza los datos de los anteriores tutores
          if (tutor.count > 0) {
            logger.info('[tutor.controller][creaTutor]', 'tutores pcd ->', tutor.count);
            const actualizaTutor = await app.dao.tutor.actualizarTutores(idPcd, usuarioAuditoria);
            if (!actualizaTutor) {
              throw new Error('Error al actualizar Tutor anterior');
            }
          }
          const actualizaPersona = await app.dao.persona.actualizarPersona(idPersona, datosPersona);
          if (actualizaPersona) {
            await app.dao.tutor.crearTutor(datosTutor);
          } else {
            throw new Error('Error al actualizar los datos de persona');
          }
        } else {
          throw new Error('No puede asignar como tutor a la misma persona.');
        }
      });
      if (transaccion.finalizado) {
        res.status(201).json({
          finalizado: true,
          mensaje: 'Creación del registro exitoso.',
          datos: {},
        });
      } else {
        throw new Error(transaccion.mensaje);
      }
    } catch (error) {
      if (datosArchivo && datosArchivo) {
        fs.unlink(datosArchivo, (err) => {
          if (err) {
            error.message = err;
          }
          logger.error('[tutor.controller][creaTutor]', 'error ->', error.message);
          res.status(412).json({
            finalizado: false,
            mensaje: error.message,
            datos: {},
          });
        });
      } else {
        logger.error('[tutor.controller][creaTutor]', 'error ->', error.message);
        res.status(412).json({
          finalizado: false,
          mensaje: error.message,
          datos: {},
        });
      }
    }
  };


  const eliminarTutor = async (req, res) => {
    const idTutor = req.params.id;
    try {
      const tutorObtener = await app.dao.tutor.obtenerTutor({
        where: {
          id_tutor: idTutor,
          estado: 'ACTIVO',
        },
      });
      if (tutorObtener) {
        const tutorActualizar = {
          estado: 'INACTIVO',
          _usuario_creacion: req.body.audit_usuario.id_usuario,
        };
        await tutorObtener.updateAttributes(tutorActualizar);
        res.status(200).json({
          finalizado: true,
          mensaje: 'Eliminación de tutor exitoso.',
          datos: {},
        });
      } else {
        throw new Error('El tutor no se encuentra registrado en el sistema o no esta activo.');
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

  _app.controller.tutor = {
    crearTutor,
    eliminarTutor,
  };
};
