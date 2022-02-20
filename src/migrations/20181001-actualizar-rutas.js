// 'use strict';

module.exports = {
  up (queryInterface) {
    return queryInterface.bulkInsert('ruta', [
      {
        id_ruta: 38,
        ruta: '/api/v1/centralizador/reporte_acumulado',
        descripcion: 'Ruta para generar reportes acumulado',
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date()
      },
      {
        id_ruta: 39,
        ruta: '/api/v1/centralizador/acumulado',
        descripcion: 'Ruta para obtener listado acumulado',
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date()
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
