// 'use strict';

module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('menu', [{
        id_menu: 20,
        nombre: 'REGULARIZADOS MENSUAL',
        descripcion: 'Regularizados mensual ministerio',
        orden: 4,
        ruta: 'listado_bono_regularizado',
        icono: 'group',
        method_get: true,
        method_post: true,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: 10,
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
