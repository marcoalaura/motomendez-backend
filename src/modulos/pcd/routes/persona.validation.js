import Joi from '../../../lib/joi';

module.exports = {
  segipPersona: {
    body: {
      cedula_identidad: Joi.string().required(),
      fecha_nacimiento: Joi.string().required(),
    },
  },
};
