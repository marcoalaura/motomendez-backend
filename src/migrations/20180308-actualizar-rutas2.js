module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('rol_ruta', [{
        id_rol_ruta: 75,
        method_get: false,
        method_post: true,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 2,
        fid_ruta: 32,
      },
      {
        id_rol_ruta: 76,
        method_get: false,
        method_post: true,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 3,
        fid_ruta: 32,
      },
      {
        id_rol_ruta: 77,
        method_get: false,
        method_post: true,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 4,
        fid_ruta: 32,
      },
      {
        id_rol_ruta: 78,
        method_get: false,
        method_post: true,
        method_put: false,
        method_delete: false,
        estado: 'ACTIVO',
        _usuario_creacion: 1,
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
        fid_rol: 5,
        fid_ruta: 32,
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
