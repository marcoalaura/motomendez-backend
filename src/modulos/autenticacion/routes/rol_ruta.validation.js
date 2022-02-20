import Joi from '../../../lib/joi';

module.exports = {
  getRolRutaId: {
    params: {
      id: Joi.number().required(),
    },
  },
};
