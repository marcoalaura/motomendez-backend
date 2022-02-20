import Joi from '../../../lib/joi';

module.exports = {
  crearTutor: {
    params: {
      id_pcd: Joi.number().required(),
      id_persona: Joi.number().required(),
    },
  },
  deleteTutor: {
    params: {
      id: Joi.number().required(),
    },
  },
};
