// 'use strict';

module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('ruta', [{
        id_ruta: 32,
        ruta: '/api/v1/usuarios/contraseña',
        descripcion: 'Ruta para cambio de contraseña',
        method_get: false,
        method_post: true,
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
