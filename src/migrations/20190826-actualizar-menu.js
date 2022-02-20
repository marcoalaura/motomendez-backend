// 'use strict';

module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('menu', [{
        id_menu: 25,
        nombre: 'OPERACIONES',
        descripcion: 'Operaciones en el sistema',
        orden: 5,
        ruta: '',
        icono: 'gears',
        method_get: true,
        method_post: true,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: null,
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_menu: 26,
        nombre: 'CORTE ANUAL',
        descripcion: 'Operaciones para el corte anual',
        orden: 6,
        ruta: 'operaciones_anual',
        icono: 'gears',
        method_get: true,
        method_post: true,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: 25,
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_menu: 27,
        nombre: 'CORTE MENSUAL',
        descripcion: 'Operaciones para el corte mensual',
        orden: 6,
        ruta: 'operaciones_mensual',
        icono: 'gears',
        method_get: true,
        method_post: true,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        fid_menu_padre: 25,
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_menu: 28,
        nombre: 'LISTADO SIPRUN-IBC',
        descripcion: 'Opciones para listar siprun e ibc',
        orden: 10,
        ruta: 'listado_siprun_ibc',
        icono: 'group',
        method_get: false,
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
  