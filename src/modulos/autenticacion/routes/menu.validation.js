import Joi from '../../../lib/joi';

module.exports = {
  getMenuId: {
    params: {
      id: Joi.number().required(),
    },
  },
  createMenu: {
    body: {
      nombre: Joi.string().required(),
      descripcion: Joi.string().required(),
      orden: Joi.number().required(),
      ruta: Joi.string(),
      icono: Joi.string(),
      method_get: Joi.boolean().required(),
      method_post: Joi.boolean().required(),
      method_put: Joi.boolean().required(),
      method_delete: Joi.boolean().required(),
      fid_menu_padre: Joi.number().allow(null),
    },
  },
  updateMenu: {
    body: {
      nombre: Joi.string().required(),
      descripcion: Joi.string().required(),
      orden: Joi.number().required(),
      ruta: Joi.string(),
      icono: Joi.string(),
      method_get: Joi.boolean().required(),
      method_post: Joi.boolean().required(),
      method_put: Joi.boolean().required(),
      method_delete: Joi.boolean().required(),
      fid_menu_padre: Joi.number().allow(null),
    },
    params: {
      id: Joi.number().required(),
    },
  },
  deleteMenu: {
    params: {
      id: Joi.number().required(),
    },
  },
};
