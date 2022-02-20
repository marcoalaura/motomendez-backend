// 'use strict';

module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('menu', [{
        id_menu: 22,
        nombre: 'CAMBIO MUNICIPIO',
        descripcion: 'Opciones para el cambio de municipio',
        orden: 1,
        ruta: '',
        icono: 'group',
        method_get: false,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: null,
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_menu: 23,
        nombre: 'REGISTRAR',
        descripcion: 'Realizar el registro de cambio de municipio',
        orden: 1,
        ruta: 'reg_cambio_municipio',
        icono: 'group',
        method_get: true,
        method_post: true,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: 22,
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
