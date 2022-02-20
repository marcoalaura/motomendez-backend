import Joi from '../../../lib/joi';

module.exports = {
  getRolId: {
    params: {
      id: Joi.number().required(),
    },
  },
  createRol: {
    body: {
      nombre: Joi.string().required(),
      descripcion: Joi.string().min(5).max(50),
      peso: Joi.number(),
    },
  },
  updateRol: {
    body: {
      nombre: Joi.string().required(),
      descripcion: Joi.string().min(5).max(50),
      peso: Joi.number(),
    },
    params: {
      id: Joi.number().required(),
    },
  },
  deleteRol: {
    params: {
      id: Joi.number().required(),
    },
  },
};
