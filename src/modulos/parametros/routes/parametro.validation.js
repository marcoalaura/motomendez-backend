import Joi from '../../../lib/joi';

module.exports = {
  obtenerListadoGrupo: {
    query: {
      grupo: Joi.string().required(),
    },
  },
};
