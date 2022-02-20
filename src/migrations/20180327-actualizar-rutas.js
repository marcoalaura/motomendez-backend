// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('ruta', [{
      id_ruta: 33,
      ruta: '/api/v1/centralizador/sigep/actualiza_pagos',
      descripcion: 'Ruta para actualizar el estado de los bonos que han sido pagados.',
      method_get: true,
      method_post: false,
      method_put: false,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
    }, {
      id_ruta: 34,
      ruta: '/api/v1/centralizador/sigep/bono_regularizados',
      descripcion: 'Ruta para mandar a SIGEP los regularizados.',
      method_get: true,
      method_post: false,
      method_put: false,
      method_delete: false,
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
    }, {
      id_ruta: 35,
      ruta: '/api/v1/centralizador/reporte_retroactivo',
      descripcion: 'Ruta generar las listas de los retroactivos',
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
