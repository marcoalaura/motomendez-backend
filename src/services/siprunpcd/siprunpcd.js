import request from 'request';
import config from '../../config/config';

module.exports.obtenerListas = (fechaInicio, fechaFinal) => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.siprunpcd.url}${configuracion.siprunpcd.path}listapcd?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFinal}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.siprunpcd.token,
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

module.exports.obtenerCertificado = (cedula) => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.siprunpcd.url}${configuracion.siprunpcd.pcd}pcd/${cedula}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.siprunpcd.token,
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

module.exports.actualizarObservado = (ci, observacion, codigo) => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.siprunpcd.url}${configuracion.siprunpcd.path}pcd/${ci}`,
      method: 'PUT',
      headers: {
        Authorization: configuracion.siprunpcd.token,
      },
      body: {
        codigo,
        observacion,
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
