// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('ruta', [
      {
        id_ruta: 36,
        ruta: '/api/v1/solicitudes',
        descripcion: 'Ruta para obtener solicitudes en csv.',
        method_get: false,
        method_post: true,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_ruta: 37,
        ruta: '/api/v1/centralizador/bono_retroactivo',
        descripcion: 'Ruta para generar retroactivo',
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
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
