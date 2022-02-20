// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('rol_menu', [{
      fid_menu: 24,
      fid_rol: 2,
      method_get: true,
      method_post: true,
      method_put: true,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date()
    },
    {
      fid_menu: 24,
      fid_rol: 6,
      method_get: true,
      method_post: true,
      method_put: true,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date()
    },
    {
      fid_menu: 24,
      fid_rol: 7,
      method_get: true,
      method_post: true,
      method_put: true,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date()
    },
    {
      fid_menu: 24,
      fid_rol: 8,
      method_get: true,
      method_post: false,
      method_put: false,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date()
    },
    ], {});
  },

  down() {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
