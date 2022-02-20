import request from 'request';
import rp from 'request-promise';
// import ar from 'async-request';
import config from '../../config/config';

/**
 * Obtiene datos de la persona basado en datos como el número de documento(ci),
 * complemento y su fecha de nacimiento.
 * @param  {Objeto} datos Objeto con los datos necesarios
 * @return {Promesa}      Retorna una promesa
 */
module.exports.verificarSegip = (datos) => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    let url = `${configuracion.segip.url}${configuracion.segip.path}personas/`;
    if (datos) {
      if (datos.documento_identidad) {
        url = `${url}${datos.documento_identidad}`;
        if (datos.complemento && datos.complemento !== null) {
          url = `${url}?complemento=${datos.complemento}`;
          if (datos.fecha_nacimiento) {
            url = `${url}&fecha_nacimiento=${datos.fecha_nacimiento}`;
          }
        } else if (datos.fecha_nacimiento) {
          url = `${url}?fecha_nacimiento=${datos.fecha_nacimiento}`;
        }
      }
    }
    request({
      url,
      method: 'GET',
      headers: {
        Authorization: configuracion.segip.tokenKong,
        // apikey: configuracion.segip.credenciales.apikey,
      },
      json: true,
    }, (err, res) => {
      const respuesta = {
        datos: {},
        finalizado: false,
      };
      if (!err) {
        if (res && res.body && res.body.ConsultaDatoPersonaEnJsonResult) {
          const respuestaSegip = res.body.ConsultaDatoPersonaEnJsonResult;
          if (respuestaSegip.CodigoRespuesta === '2') {
            respuesta.finalizado = true;
            respuesta.datos = JSON.parse(respuestaSegip.DatosPersonaEnFormatoJson);
            if (respuesta.datos.PrimerApellido === '--') {
              respuesta.datos.PrimerApellido = '';
            }
            if (respuesta.datos.SegundoApellido === '--') {
              respuesta.datos.SegundoApellido = '';
            }
            respuesta.mensaje = 'Datos obtenidos exitosamente.';
          } else if (respuestaSegip.CodigoRespuesta === '1') {
            respuesta.mensaje = 'No se encontró un registro con los datos solicitados.';
          } else if (respuestaSegip.CodigoRespuesta === '3') {
            respuesta.mensaje = `Se encontro mas de un registro para ${datos.documento_identidad} ${datos.fecha_nacimiento}`;
          } else {
            respuesta.mensaje = respuestaSegip.DescripcionRespuesta;
          }
        } else {
          respuesta.mensaje = 'Error al recuperar los datos.';
        }
        return resolve(respuesta);
      }
      return reject(err);
    });
  });
};

/**
 * Certifica una persona, basado en el número de documento(ci).
 * @param  {Numero} ci Número de documento a certificar
 * @return {Promesa}   Retorna una promesa
 */
module.exports.consultaDatoPersonaCertificacion = (ci) => {
  return new Promise((resolve, reject) => {
    request({
      url: `${config.app.segip.url}${config.app.segip.path}personas/certificacion/${ci}`,
      method: 'GET',
      headers: {
        Authorization: config.app.segip.tokenKong,
        apikey: config.app.segip.credenciales.apikey,
      },
      json: true,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res.body);
    });
  });
};

/**
 * Obtiene los datos de una persona, basado en un codigo.
 * @param  {[type]} codigo [description]
 * @return {[type]}        [description]
 */
module.exports.obtenerDocumentoPorCodigoUnico = (codigo) => {
  return new Promise((resolve, reject) => {
    request({
      url: `${config.app.segip.url}${config.app.segip.path}personas/codigo/${codigo}`,
      method: 'GET',
      headers: {
        Authorization: config.app.segip.tokenKong,
        apikey: config.app.segip.credenciales.apikey,
      },
      json: true,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res.body);
    });
  });
};

/**
 * [consultaDatoPersonaContrastacion description]
 * @param  {[type]} listaCampo  [description]
 * @param  {[type]} tipoPersona [description]
 * @return {[type]}             [description]
 */
module.exports.consultaDatoPersonaContrastacion = (listaCampo, tipoPersona) => {
  return new Promise((resolve, reject) => {
    const lista = JSON.stringify(listaCampo);
    request({
      url: `${config.app.segip.url}${config.app.segip.path}personas/contrastacion?tipo_persona=${tipoPersona}&lista_campo=${lista}`,
      method: 'GET',
      headers: {
        Authorization: config.app.segip.tokenKong,
        apikey: config.app.segip.credenciales.apikey,
      },
      json: true,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res.body);
    });
  });
};

/**
 * [estado description]
 * @return {[type]} [description]
 */
module.exports.estado = () => {
  return new Promise((resolve, reject) => {
    request({
      url: `${config.app.segip.url}${config.app.segip.path}status`,
      method: 'GET',
      headers: {
        Authorization: config.app.segip.tokenKong,
        apikey: config.app.segip.credenciales.apikey,
      },
      json: true,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};


/**
 * Obtiene datos de la persona basado en datos como el número de documento(ci),
 * complemento y su fecha de nacimiento.
 * @param  {Objeto} datos Objeto con los datos necesarios
 * @return {Promesa}      Retorna una promesa
 */
module.exports.contrastacion = (datos) => {
  const configuracion = config();
  let url = `${configuracion.segip.url}${configuracion.segip.path}personas/contrastacion`;
  url = `${url}?tipo_persona=1&lista_campo=${encodeURI(JSON.stringify(datos))}`;
  const options = {
    url,
    method: 'GET',
    headers: {
      Authorization: configuracion.segip.tokenKong,
    },
    json: true,
  };
  return rp(options)
    .then((response) => {
      const respuesta = {
        finalizado: false,
      };
      if (response && response.ConsultaDatoPersonaContrastacionResult) {
        const respuestaSegip = response.ConsultaDatoPersonaContrastacionResult;
        respuesta.mensaje = respuestaSegip.DescripcionRespuesta;
        if (respuestaSegip.CodigoRespuesta === '2') {
          const keys = JSON.parse(respuestaSegip.ContrastacionEnFormatoJson);
          let datosRes = '';
          // const values = Object.values(JSON.parse(respuestaSegip.ContrastacionEnFormatoJson));
         /*  for (let i = 0; i < keys.length; i += 1) {
            if (values[i] === 0) {
              datosRes = `${datosRes} ${keys[i]} `;
            }
          } */
          for (const key in keys) {
            if (keys[key] === 0) {
              datosRes = `${datosRes} ${key} `;
            }
          }
          if (datosRes.length === 0) {
            respuesta.finalizado = true;
            respuesta.datos = '';
            return respuesta;
          } else {
            respuesta.finalizado = false;
            respuesta.datos = `No coinciden:${datosRes}`;
            return respuesta;
          }
          // return respuesta;
        } else {
          respuesta.datos = respuestaSegip.DescripcionRespuesta;
          return respuesta;
        }
      } else {
        respuesta.mensaje = 'Error al leer los datos de Respuesta';
        respuesta.datos = '';
        return respuesta;
      }
    })
    .catch((error) => {
      return {
        finalizado: false,
        mensaje: error.message,
        datos: error.message,
      };
    });
  /* return new Promise((resolve, reject) => {
    let url = `${configuracion.segip.url}${configuracion.segip.path}personas/contrastacion`;
    if (datos) {
      if (datos.NumeroDocumento && datos.Nombres && datos.PrimerApellido && datos.SegundoApellido && datos.FechaNacimiento) {
        url = `${url}?tipo_persona=1&lista_campo=${JSON.stringify(datos)}`;
        console.log('------------------------------------');
        console.log(url);
        console.log('------------------------------------');
        request({
          uri: url,
          method: 'GET',
          headers: {
            Authorization: configuracion.segip.tokenKong,
          },
          json: true,
        }, (err, res) => {
          const respuesta = {
            datos: {},
            finalizado: false,
          };
          if (!err) {
            console.log('-------------sssssssssssssssssssssssss-----------------------');
            console.log(res.body);
            console.log('------------------------------------');
            if (res && res.body && res.body.ConsultaDatoPersonaContrastacionResult) {
              const respuestaSegip = res.body.ConsultaDatoPersonaContrastacionResult;
              if (respuestaSegip.CodigoRespuesta === '2') {
                const d = Object.entries(JSON.parse(respuestaSegip.ContrastacionEnFormatoJson));
                for (const [key, val] of d) {
                  if (val === 0) {
                    respuesta.datos[key] = 'No coincide';
                  }
                }
                if (Object.keys(respuesta.datos).length === 0) {
                  respuesta.finalizado = true;
                  // return resolve(respuesta);
                } else {
                  respuesta.finalizado = false;
                  // return resolve(respuesta);
                }
                return resolve(respuesta);
              } else {
                respuesta.mensaje = respuestaSegip.DescripcionRespuesta;
                return resolve(respuesta);
              }
            } else {
              respuesta.mensaje = 'Error al leer los datos de Respuesta';
              return reject(respuesta);
            }
          } else {
            respuesta.mensaje = err.message;
            return reject(respuesta);
          }
        });
      } else {
        return reject('Faltan Datos para la contrastación');
      }
    }
   // return reject('Error en entrada de datos');
  }); */
};
