// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('rol', [
      {
        // 1
        nombre: 'ADMIN',
        descripcion: 'Administrador',
        peso: 0,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        // 2
        nombre: 'MINISTERIO',
        descripcion: 'MINISTERIO',
        peso: 0,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        // 3
        nombre: 'MUNICIPIO',
        descripcion: 'Municipios',
        peso: 0,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        // 4
        nombre: 'CONSULTA',
        descripcion: 'Usuarios de consulta',
        peso: 0,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        // 5
        nombre: 'SERVICIO_OVT',
        descripcion: 'Administrador servicios',
        peso: 0,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
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
