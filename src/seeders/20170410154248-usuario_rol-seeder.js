// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('usuario_rol', [
      {
        fid_usuario: 1,
        fid_rol: 1,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        fid_usuario: 2,
        fid_rol: 2,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        fid_usuario: 3,
        fid_rol: 5,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        fid_usuario: 4,
        fid_rol: 4,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      },
      {
        fid_usuario: 5,
        fid_rol: 3,
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
