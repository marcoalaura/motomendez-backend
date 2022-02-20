// 'use strict';

module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('menu', [{
        id_menu: 21,
        nombre: 'CAMBIO MUNICIPIO',
        descripcion: 'Solicitudes de cambio de municipio',
        orden: 4,
        ruta: 'cambio_municipio',
        icono: 'group',
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: 16,
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
