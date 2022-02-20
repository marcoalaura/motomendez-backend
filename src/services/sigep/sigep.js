import moment from 'moment';
import request from 'request';
import config from '../../config/config';

request.debug = true;
/**
 * estado - Cliente para verificar el estado del servicio del MEFP-SIGEP
 */
module.exports.estado = () => {
  const configuracion = config();
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}estado`,
      method: 'GET',
      headers: {
        Authorization: configuracion.sigep.token,
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

/**
 * registrarBeneficiario - Cliente para registro de un nuevo beneficiario
 * @param {object} datos
 */
module.exports.registrarBeneficiario = (datos) => {
  const configuracion = config();
  const datosBeneficiario = {
    numeroDocumento: datos.numero_documento,
    complemento: datos.complemento || '',
    expDepartamento: datos.exp_departamento,
    expPais: datos.exp_pais,
    primerApellido: datos.primer_apellido,
    segundoApellido: datos.segundo_apellido,
    apellidoCasada: datos.apellido_casada || '',
    nombres: datos.nombres,
    email: datos.email || '',
    fechaNacimiento: moment(datos.fecha_nacimiento).format('DD-MM-YYYY'),
    estadoCivil: datos.estado_civil,
    formatoInf: datos.formato_inf,
    pais: datos.pais,
    ciudad: datos.ciudad,
    casillaPostal: datos.casilla_postal || '',
    localidad: datos.localidad.substr(0, 30),
    direccion: datos.direccion,
    telefono: datos.telefono || '',
    celular: '',
    fax: '',
    email: '',
    origen: configuracion.origen,
    tipoId: 'C',  // Por el momento solo se estan pagando personas que contrasten con segip y tengan CI, no extranjeros
  };
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/naturales`,
      method: 'POST',
      headers: {
        Authorization: configuracion.sigep.token,
      },
      body: datosBeneficiario,
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};


/**
 * actualizarBeneficiario - Cliente para actualizacion de datos beneficiario
 * @param {object} datos
 */
module.exports.actualizarBeneficiario = (datos) => {
  const configuracion = config();
  const datosBeneficiario = {
    beneficiario: datos.cod_beneficiario,
    numeroDocumento: datos.numero_documento,
    complemento: datos.complemento || '',
    expDepartamento: datos.exp_departamento,
    expPais: datos.exp_pais,
    primerApellido: datos.primer_apellido,
    segundoApellido: datos.segundo_apellido,
    apellidoCasada: datos.apellido_casada || '',
    nombres: datos.nombres,
    email: datos.email || '',
    fechaNacimiento: moment(datos.fecha_nacimiento).format('DD-MM-YYYY'),
    estadoCivil: datos.estado_civil,
    formatoInf: datos.formato_inf,
    pais: datos.pais,
    ciudad: datos.ciudad,
    casillaPostal: datos.casilla_postal || '',
    localidad: datos.localidad.substr(0, 30),
    direccion: datos.direccion,
    telefono: datos.telefono || '',
    celular: '',
    fax: '',
    email: '',
    origen: configuracion.origen,
    tipoId: 'C',  // Por el momento solo se estan pagando personas que contrasten con segip y tengan CI, no extranjeros
  };
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/naturales`,
      method: 'PUT',
      headers: {
        Authorization: configuracion.sigep.token,
      },
      body: datosBeneficiario,
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};
/**
 * consultaBeneficiario - Cliente para consultar el registro de un beneficiario
 * @param {object} datos
 */
module.exports.consultaBeneficiario = (datos) => {
  const configuracion = config();
  const datosBeneficiario = `numeroDocumento=${datos.numero_documento}&primerApellido=${datos.primer_apellido || ''}&segundoApellido=${datos.segundo_apellido || ''}&nombres=${datos.nombres}&fechaNacimiento=${moment(datos.fecha_nacimiento).format('DD-MM-YYYY')}&complemento=${datos.complemento}&tipoPersona=C`;
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/naturales?${encodeURI(datosBeneficiario)}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.sigep.token,
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

module.exports.actualizaBeneficiario = (datos) => {
  const configuracion = config();
  const datosBeneficiario = {
    numeroDocumento: datos.numero_documento,
    complemento: datos.complemento || '',
    expDepartamento: datos.exp_departamento,
    expPais: datos.exp_pais,
    primerApellido: datos.primer_apellido,
    segundoApellido: datos.segundo_apellido,
    apellidoCasada: datos.apellido_casada || '',
    nombres: datos.nombres,
    email: datos.email || '',
    fechaNacimiento: moment(datos.fecha_nacimiento).format('DD-MM-YYYY'),
    estadoCivil: datos.estado_civil,
    formatoInf: datos.formato_inf,
    pais: datos.pais,
    ciudad: datos.ciudad,
    casillaPostal: datos.casilla_postal || '',
    localidad: datos.localidad,
    direccion: datos.direccion,
    telefono: datos.telefono || '',
    celular: '',
    fax: '',
  };
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/naturales`,
      method: 'PUT',
      headers: {
        Authorization: configuracion.sigep.token,
      },
      body: datosBeneficiario,
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};
/**
 * registrarDatosAdicionales - Cliente para registrar los datos adicionales de un beneficiario
 * @param {object} datos
 */
module.exports.registrarDatosAdicionales = (datos) => {
  const configuracion = config();
  const datosAdicionales = {
    beneficiario: datos.cod_beneficiario,
    bono: 1, // --> 1 corresponde a SIPRUNPCD
    idUbigeo: datos.id_ubigeo,
    idEntidadPago: datos.id_entidad_pago,
  };
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/datosAdicionales`,
      method: 'POST',
      headers: {
        Authorization: configuracion.sigep.token,
      },
      body: datosAdicionales,
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};

/**
 * consultarDatosAdicionales - Cliente para consultar los datos adicionales de un beneficiario
 * @param {number} codBeneficiario
 */
module.exports.consultarDatosAdicionales = (codBeneficiario) => {
  const configuracion = config();
  const datosAdicionales = `beneficiario=${codBeneficiario}&bono=1`;
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/datosAdicionales?${encodeURI(datosAdicionales)}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.sigep.token,
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

/**
 * actualizarDatosAdicionales - Método para actualizar Datos adicionales de beneficiario
 * @param {object} datos
 */
module.exports.actualizarDatosAdicionales = (datos) => {
  const configuracion = config();
  const datosAdicionales = {
    beneficiario: datos.cod_beneficiario,
    bono: 1, // --> 1 corresponde a SIPRUNPCD
    idUbigeo: datos.id_ubigeo,
    idEntidadPago: datos.id_entidad_pago,
  };
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/datosAdicionales`,
      method: 'PUT',
      headers: {
        Authorization: configuracion.sigep.token,
      },
      body: datosAdicionales,
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};

/**
 * registrarBono - Método para registrar el bono
 * @param {object} datos
 */
module.exports.registrarBono = (datos) => {
  const configuracion = config();
  const datosBono = {
    beneficiario: datos.beneficiario,
    bono: 1, // --> 1 corresponde a sIPRUNPCD
    gestion: datos.gestion,
    mes: datos.mes,
    // monto: configuracion.monto,
    // origen: configuracion.origen,
  };
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/bonos`,
      method: 'POST',
      headers: {
        Authorization: configuracion.sigep.token,
      },
      body: datosBono,
      json: true,
    }, (err, res) => {
      if (!err) {
        return resolve(res);
      }
      return reject(err);
    });
  });
};

/**
 * consultarBono - Método para consultar el estado del bono
 * @param {object} datos
 */
module.exports.consultarBono = (datos) => {
  const configuracion = config();
  const datosBono = `identificadorPagoBono=${datos.id_bono}`; // TODO: segun la documentacion es asi, pero el apidoc es diferente
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/bonos?${datosBono}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.sigep.token,
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

/**
 * consultarCodigoBono - Método para consultar el código del bono
 * @param {object} datos
 */
module.exports.consultarCodigoBono = (datos) => {
  const configuracion = config();
  const beneficiario = datos.beneficiario;
  const bono = 1;
  const gestion = datos.gestion;
  const mes = datos.mes;
  const datosBono = `beneficiario=${beneficiario}&bono=${bono}&gestion=${gestion}&mes=${mes}`;

  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/bonos?${datosBono}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.sigep.token,
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

/**
 * consultarPago - Método para consultar el estado del bono
 * @param {object} datos
 */
module.exports.consultarPago = (datos) => {
  const configuracion = config();
  const datosBono = datos.id_bono; // TODO: segun la documentacion es asi, pero el apidoc es diferente
  return new Promise((resolve, reject) => {
    request({
      url: `${configuracion.sigep.url}${configuracion.sigep.path}beneficiarios/bonos/${datosBono}`,
      method: 'GET',
      headers: {
        Authorization: configuracion.sigep.token,
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
