// 'use strict';

module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('menu', [{
        id_menu: 24,
        nombre: 'CORTE ANUAL',
        descripcion: 'Opciones para tmp corte anual',
        orden: 1,
        ruta: 'corte_anual',
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
