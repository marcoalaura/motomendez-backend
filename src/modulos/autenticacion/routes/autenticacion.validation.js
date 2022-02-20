import Joi from '../../../lib/joi';

module.exports = {
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
};
