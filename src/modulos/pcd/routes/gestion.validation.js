import Joi from '../../../lib/joi';

module.exports = {
  detalleGestion: {
    params: {
      id_gestion: Joi.number().required(),
    },
  },
};
