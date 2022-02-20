// 'use strict';

module.exports = {
  up (queryInterface) {
    return queryInterface.bulkInsert('rol', [{
      // 6
      id_rol: 6,
      nombre: 'SALUD',
      descripcion: 'Administrador del Ministerio de Salud',
      peso: 0,
      estado: 'ACTIVO',
      _usuario_creacion: '1',
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
    }, {
      // 7
      id_rol: 7,
      nombre: 'IBC',
      descripcion: 'Administrador del IBC',
      peso: 0,
      estado: 'ACTIVO',
      _usuario_creacion: '1',
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
    }, {
      // 8
      id_rol: 8,
      nombre: 'ECONOMIA',
      descripcion: 'Administrador del Ministerio de Economía',
      peso: 0,
      estado: 'ACTIVO',
      _usuario_creacion: '1',
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
  },
};
