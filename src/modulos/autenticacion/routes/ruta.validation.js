import Joi from '../../../lib/joi';

module.exports = {
  getRutaId: {
    params: {
      id: Joi.number().required(),
    },
  },
  createRuta: {
    body: {
      ruta: Joi.string().required(),
      descripcion: Joi.string().min(5).max(10),
      method_get: Joi.boolean(),
      method_post: Joi.boolean().required(),
      method_put: Joi.boolean(),
      method_delete: Joi.boolean().required(),
    },
  },
  updateRuta: {
    body: {
      ruta: Joi.string().required(),
      descripcion: Joi.string().min(5).max(10),
      method_get: Joi.boolean(),
      method_post: Joi.boolean().required(),
      method_put: Joi.boolean(),
      method_delete: Joi.boolean().required(),
    },
    params: {
      id: Joi.number().required(),
    },
  },
  deleteRuta: {
    params: {
      id: Joi.number().required(),
    },
  },
};
