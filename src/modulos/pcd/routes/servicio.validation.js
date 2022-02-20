import Joi from '../../../lib/joi';

module.exports = {
  crearBeneficio: {
    body: {
      documento_identidad: Joi.string().required(),
      nombres: Joi.string().required(),
      fecha_nacimiento: Joi.string().required(),
      fecha_inicio: Joi.string().required(),
      tipo: Joi.string().required(),
      mes: Joi.number().required(),
      gestion: Joi.number().required()
    },
  },
};
