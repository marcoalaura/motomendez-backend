// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('usuario', [
      {
        email: 'admin',
        usuario: 'admin',
        contrasena: '672caf27f5363dc833bda5099775e891',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_persona: 1,
      },
      {
        email: 'ministerio',
        usuario: 'ministerio',
        contrasena: '202cb962ac59075b964b07152d234b70',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_persona: 2,
      },
      {
        email: 'servicio',
        usuario: 'servicio',
        contrasena: '202cb962ac59075b964b07152d234b70',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_persona: 1,
      },
      {
        email: 'consulta',
        usuario: 'consulta',
        contrasena: '202cb962ac59075b964b07152d234b70',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_persona: 1,
      },
      {
        email: 'municipio',
        usuario: 'municipio',
        contrasena: '202cb962ac59075b964b07152d234b70',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_persona: 1,
        cod_municipio: '020101',
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
