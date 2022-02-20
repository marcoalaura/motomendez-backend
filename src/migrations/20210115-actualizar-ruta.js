// 'use strict';

module.exports = {
  up (queryInterface) {
    return queryInterface.bulkInsert('ruta', [
      {
        id_ruta: 59,
        ruta: '/api/v1/centralizador/inhabilitar-pcd',
        descripcion: 'Ruta para inhabilitar PCD desde el rol Ministerio de Trabajo, para casos especiales',
        method_get: false,
        method_post: false,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_ruta: 60,
        ruta: '/api/v1/siprunpcd-ci',
        descripcion: 'Ruta para obtener las pcd del SIPRUNPCD según CI.',
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      }
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
