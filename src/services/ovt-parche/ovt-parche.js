import request from 'request';
import config from '../../config/config';

module.exports.obtenerListasPersonal = (fecha) => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.ovtParche.url}${configuracion.ovtParche.path}listado?fecha_vigencia=${fecha}&tipo=PERSONA CON DISCAPACIDAD`,
      method: 'GET',
      headers: {
        Authorization: configuracion.ovtParche.token,
      },
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};
