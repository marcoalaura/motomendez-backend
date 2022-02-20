// 'use strict';

module.exports = {
  up (queryInterface) {
    return queryInterface.bulkInsert('ruta', [
      {
        id_ruta: 40,
        ruta: '/api/v1/centralizador/crear_corte',
        descripcion: 'Ruta para importar csv',
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
        id_ruta: 41,
        ruta: '/api/v1/centralizador/filtrar_corte',
        descripcion: 'Ruta para filtrar la inforamción importada',
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
        id_ruta: 42,
        ruta: '/api/v1/centralizador/listar_corte',
        descripcion: 'Ruta para listar informacion importada',
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_ruta: 43,
        ruta: '/api/v1/centralizador/tmp_corte_anual',
        descripcion: 'Ruta gestionar tmp_corte_anual',
        method_get: true,
        method_post: false,
        method_put: true,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        id_ruta: 45,
        ruta: '/api/v1/centralizador/obtener_corte_anual',
        descripcion: 'Ruta para obtener el listado del corte anual filtrado',
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
        id_ruta: 46,
        ruta: '/api/v1/centralizador/contrastar_corte_anual',
        descripcion: 'Ruta para realizar la contrastacion inicial',
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

  down () {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
