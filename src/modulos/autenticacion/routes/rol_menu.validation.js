import Joi from '../../../lib/joi';

module.exports = {
  getRolMenuId: {
    params: {
      id: Joi.number().required(),
    },
  },
};
