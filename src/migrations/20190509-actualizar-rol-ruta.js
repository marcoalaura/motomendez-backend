// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('rol_ruta', [{
      id_rol_ruta: 88,
      method_get: true,
      method_post: false,
      method_put: false,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
      fid_rol: 3,
      fid_ruta: 16,
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
