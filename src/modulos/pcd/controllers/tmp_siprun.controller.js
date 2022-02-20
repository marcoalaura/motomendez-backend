import moment from 'moment';
import logger from './../../../lib/logger';
import util from './../../../lib/util';

module.exports = (app) => {
  const _app = app;
  /**
   * formatearDatos - Método para formatear los datos del temporal siprunpcd
   * @param {object} datos
   */
  const formatearDatos = (datos) => {
    return {
      ci: datos.complemento ? `${datos.nro_documento}-${datos.complemento}` : datos.nro_documento,
      expedido: datos.exp_departamento,
      ap_paterno: datos.primer_apellido,
      ap_materno: datos.segundo_apellido,
      ap_casada: datos.apellido_casada,
      formato_inf: datos.formato_inf,
      nombres: datos.nombres,
      fecha_nac: datos.fecha_nacimiento ? datos.fecha_nacimiento : null,
      sexo: null,
      estado_civil: datos.estado_civil,
      celular: datos.celular,
      direccion: datos.direccion,
      id_municipio: datos.codigo_municipal,
      comunidad: null,
      fecha_reg: null,
      fecha_upd: null,
      valsegip: null,
      obsvalsegip: null,
      tcertificado: [{
        id_certificado: '11111111',
        fecha_cer: datos.fecha_vigencia ? moment(datos.fecha_vigencia, 'DD/MM/YYYY').subtract(4, 'years').format('DD/MM/YYYY') : null,
        tipo_disc: datos.tipo_discapacidad,
        grados_disc: datos.grados_disc,
        porcentaje: datos.porcentaje,
        fecha_vig: datos.fecha_vigencia ? datos.fecha_vigencia : null,
      }],
    };
  };

  /**
   * obtenerDatosTmpSiprunPcd - Método para obtener el listado de pcd de la tabla temporal
   * @param {number} gestion
   * @param {number} limite
   * @param {number} pagina
   */
  const obtenerDatosTmpSiprunPcd = async (gestion, limite, pagina) => {
    try {
      const datos = await app.dao.tmp_siprunpcd.obtenerListas(gestion, limite, pagina);
      const resultadoFormateado = [];
      await Promise.all(datos.map(async (pcd) => {
        const pcdFormateado = formatearDatos(pcd);
        resultadoFormateado.push(pcdFormateado);
      }));
      return {
        body: {
          finalizado: true,
          mensaje: 'Se encontraron nuevos registros.',
          datos: resultadoFormateado,
        },
      };
    } catch (error) {
      return {
        body: {
          finalizado: false,
          mensaje: error.message,
          datos: {},
        },
      };
    }
  };

  /**
   * buscarTmpSiprunPcd - Método para buscar en la tabla temporal
   * @param {string} fechaInicio
   * @param {string} fechaFin
   */
  const buscarTmpSiprunPcd = async (req, res) => {
    try {
      const idRol = req.body.audit_usuario.id_rol;
      if (idRol <= 4) {
        const tmpSiprunpcd = await app.dao.tmp_siprunpcd.buscar(req.query);
        if (tmpSiprunpcd && tmpSiprunpcd.rows && tmpSiprunpcd.rows.length > 0) {
          await formarObservacion(tmpSiprunpcd);
          logger.info('[pcd.controller][buscarTmpSiprunPcd]', 'tmpSiprunpcd.rows.length ->', tmpSiprunpcd.rows.length);
          res.status(200).json({
            finalizado: true,
            mensaje: 'Obtencion de dato exitoso.',
            datos: {
              count: tmpSiprunpcd.count,
              rows: tmpSiprunpcd.rows,
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
      logger.error('[pcd.controller][buscarTmpSiprunPcd] %s %j', 'error ->', error.message);
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const formarObservacion = async (tmpSiprunpcd) => {
    for (let index = 0; index < tmpSiprunpcd.rows.length; index++) {
      if (tmpSiprunpcd.rows[index].observacion && tmpSiprunpcd.rows[index].observacion !== 'ACTUALIZADO_SIGEP') {
        const objObservaciones = JSON.parse(tmpSiprunpcd.rows[index].observacion);
        tmpSiprunpcd.rows[index].observacion = util.reemplazarObservacion(objObservaciones.errores[0].mensaje);
      }
    }
  };
  _app.controller.tmp_siprunpcd = {
    obtenerDatosTmpSiprunPcd,
    buscarTmpSiprunPcd,
  };
};
