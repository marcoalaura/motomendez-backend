import segip from './../../../services/segip/segip';
import moment from 'moment';

module.exports = (app) => {
  const _app = app;

  const segipPersona = async (req, res) => {
    try {
      const usuarioAuditoria = req.body.audit_usuario.id_usuario;
      const datosPersona = {
        documento_identidad: req.body.cedula_identidad,
        fecha_nacimiento: moment(req.body.fecha_nacimiento, 'DD/MM/YYYY').format(),
      };

      const verificaPersona = await app.dao.persona.buscarPersona(datosPersona);
      if (verificaPersona) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Registro obtenido correctamente.',
          datos: {
            id_persona: verificaPersona.id_persona,
            nombre_completo: verificaPersona.nombre_completo,
          },
        });
      } else {
        datosPersona.nombres = req.body.nombres;
        if (req.body.primer_apellido) datosPersona.primer_apellido = req.body.primer_apellido;
        if (req.body.segundo_apellido) datosPersona.segundo_apellido = req.body.segundo_apellido;
        if (req.body.complemento) datosPersona.complemento_documento = req.body.complemento;

        const personaSegip = {
          NumeroDocumento: req.body.cedula_identidad,
          FechaNacimiento: req.body.fecha_nacimiento,
          Nombres: req.body.nombres,
          PrimerApellido: req.body.primer_apellido ? req.body.primer_apellido : '--',
          SegundoApellido: req.body.segundo_apellido ? req.body.segundo_apellido : '--',
          Complemento: req.body.complemento ? req.body.complemento : '',
        };

        const verificaSegip = await segip.contrastacion(personaSegip);
        if (verificaSegip.finalizado) {
          datosPersona._usuario_creacion = usuarioAuditoria;
          datosPersona.fid_tipo_documento = '100';

          const creaPersona = await app.dao.persona.crearPersona(datosPersona);
          if (creaPersona) {
            res.status(200).json({
              finalizado: true,
              mensaje: verificaSegip.mensaje,
              datos: {
                id_persona: creaPersona.id_persona,
                nombre_completo: creaPersona.nombre_completo,
              },
            });
          } else {
            throw new Error('Error al guardar la Persona');
          }
        } else {
          throw new Error(verificaSegip.datos.substring(0, 500) || 'Error al contrastar');
        }
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const segipPersonaVerifica = async (req, res) => {
    try {
      const usuarioAuditoria = req.body.audit_usuario.id_usuario;
      const datosPersona = {
        documento_identidad: req.body.cedula_identidad,
        fecha_nacimiento: moment(req.body.fecha_nacimiento, 'DD/MM/YYYY').format(),
      };
      const verificaPersona = await app.dao.persona.buscarPersona(datosPersona);
      if (verificaPersona) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Registro obtenido correctamente.',
          datos: {
            id_persona: verificaPersona.id_persona,
            nombre_completo: verificaPersona.nombre_completo,
            nombres: verificaPersona.nombres,
            primer_apellido: verificaPersona.primer_apellido,
            segundo_apellido: verificaPersona.segundo_apellido,
          },
        });
      } else {
        datosPersona.fecha_nacimiento = req.body.fecha_nacimiento;
        const verificaSegip = await segip.verificarSegip(datosPersona);
        if (verificaSegip.finalizado) {
          const persona = {
            nombres: verificaSegip.datos.Nombres,
            primer_apellido: verificaSegip.datos.PrimerApellido,
            segundo_apellido: verificaSegip.datos.SegundoApellido,
            documento_identidad: verificaSegip.datos.NumeroDocumento,
            complemento_documento: verificaSegip.datos.Complemento,
            fecha_nacimiento: moment(verificaSegip.datos.FechaNacimiento, 'DD/MM/YYYY').format(),
            _usuario_creacion: usuarioAuditoria,
            fid_tipo_documento: '100', //verificar esto
          };
          const creaPersona = await app.dao.persona.crearPersona(persona);
          if (creaPersona) {
            res.status(200).json({
              finalizado: true,
              mensaje: verificaSegip.mensaje,
              datos: {
                id_persona: creaPersona.id_persona,
                nombre_completo: creaPersona.nombre_completo,
                nombres: creaPersona.nombres,
                primer_apellido: creaPersona.primer_apellido,
                segundo_apellido: creaPersona.segundo_apellido,
              },
            });
          } else {
            throw new Error('Error al guardar la Persona');
          }
        } else {
          throw new Error(verificaSegip.mensaje);
        }
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.persona = {
    segipPersona,
  };
};
