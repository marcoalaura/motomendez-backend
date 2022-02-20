import request from 'request';
import config from './src/config/config';

const obtenerListas = () => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      url: `http://localhost:${configuracion.puerto}/centralizador/tutor/regularizar_archivos`,
      method: 'GET',
      headers: {
      },
      json: true,
    }, (err, res) => {
      if (!err && res.body.status === 200) {
        return resolve(res);
      }
      return reject(err || res.body.datos.mensaje);
    });
  });
};

obtenerListas()
.then(() => console.log('PROCESO TERMINADO CON ÉXITO'))
.catch(error => console.log('ERROR EN EL PROCESO...', error));
