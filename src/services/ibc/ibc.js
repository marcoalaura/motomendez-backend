import request from 'request';
import config from '../../config/config';

module.exports.obtenerListas = (fechaInicio, fechaFinal) => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      // url: `${configuracion.ibc.url}${configuracion.ibc.path}lista?gestion=${gestion}`,
      url: `${configuracion.ibc.url}${configuracion.ibc.path}lista?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFinal}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.ibc.token,
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
