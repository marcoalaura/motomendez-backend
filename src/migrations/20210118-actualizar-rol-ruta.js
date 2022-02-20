// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('rol_ruta', [{
      id_rol_ruta: 128,
      method_get: false,
      method_post: false,
      method_put: true,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
      fid_rol: 2,
      fid_ruta: 59,
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
