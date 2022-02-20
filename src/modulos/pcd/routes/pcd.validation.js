import Joi from '../../../lib/joi';

module.exports = {
  getPcdId: {
    params: {
      id: Joi.number().required(),
    },
  },
  crearPcd: {
    body: {
      nombre: Joi.string().required(),
    },
  },
  actualizarPcd: {
    body: {
      nombre: Joi.string().required(),
    },
  },
  verificar: {
    params: {
      ci: Joi.string().required(),
    },
    query: {
      fecha_nacimiento: Joi.string().required(),
    },
  },
  verificarGestion: {
    params: {
      gestion: Joi.string().required(),
    },
  },
  registrar: {
    body: {
      documento_identidad: Joi.string().required(),
      fecha_nacimiento: Joi.string().required(),
      cod_municipio: Joi.string().required(),
      direccion: Joi.string().required(),
    },
  },
  pcdBeneficio: {
    query: {
      id_pcd: Joi.number().required(),
    },
  },
};
