// 'use strict';

module.exports = {
  up (queryInterface) {
    return queryInterface.bulkInsert('ruta', [
      {
        id_ruta: 58,
        ruta: '/api/v1/centralizador/edicion-pcd',
        descripcion: 'Ruta para actualizar datos desde le rol Ministerio de Trabajo, para casos especiales',
        method_get: false,
        method_post: false,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
    ], {});
  },

  down () {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
