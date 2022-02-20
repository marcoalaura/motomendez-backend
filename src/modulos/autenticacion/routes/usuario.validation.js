import Joi from '../../../lib/joi';

module.exports = {
  getUsuarioId: {
    params: {
      id: Joi.number().required(),
    },
  },
  createUsuario: {
    body: {
      fid_persona: Joi.number().required(),
      email: Joi.string().email().required(),
      roles: Joi.number().required(),
    },
  },
  activarUsuario: {
    body: {
      usuario: Joi.string().required(),
      contrasena: Joi.string().required(),
      codigo_contrasena: Joi.string().required(),
    },
  },
  updateUsuario: {
    body: {
      email: Joi.string().email().required(),
    },
    params: {
      id: Joi.number().required(),
    },
  },
  deleteUsuario: {
    params: {
      id: Joi.number().required(),
    },
  },
  reenviarCorreo: {
    params: {
      id: Joi.number().required(),
    },
  },
  verificarCorreo: {
    body: {
      email: Joi.string().email().required(),
    },
  },
  verificarCodigoContrasena: {
    body: {
      codigo: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  },
  modificarContrasena: {
    body: {
      codigo: Joi.string().required(),
      email: Joi.string().email().required(),
      contrasena: Joi.string().required(),
    },
  },
  cambiarContrasena: {
    body: {
      contrasena: Joi.string().required(),
      contrasena_nueva: Joi.string().required(),
    },
  },
};
