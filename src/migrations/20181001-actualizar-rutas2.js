module.exports = {
  up (queryInterface) {
    return queryInterface.bulkInsert('rol_ruta', [
      {
        id_rol_ruta: 84,
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 2,
        fid_ruta: 38
      },
      {
        id_rol_ruta: 85,
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 2,
        fid_ruta: 39
      },
      {
        id_rol_ruta: 86,
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 3,
        fid_ruta: 39
      },
      {
        id_rol_ruta: 87,
        method_get: true,
        method_post: false,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 4,
        fid_ruta: 39
      }
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
