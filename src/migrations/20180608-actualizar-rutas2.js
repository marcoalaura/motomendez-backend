module.exports = {
    up(queryInterface) {
      return queryInterface.bulkInsert('rol_ruta', [
        {
          id_rol_ruta: 82,
          method_get: false,
          method_post: true,
          method_put: false,
          method_delete: false,
          estado: 'ACTIVO',
          _usuario_creacion: 1,
          _fecha_creacion: new Date(),
          _fecha_modificacion: new Date(),
          fid_rol: 2,
          fid_ruta: 36,
        },
        {
          id_rol_ruta: 83,
          method_get: true,
          method_post: false,
          method_put: false,
          method_delete: false,
          estado: 'ACTIVO',
          _usuario_creacion: 1,
          _fecha_creacion: new Date(),
          _fecha_modificacion: new Date(),
          fid_rol: 2,
          fid_ruta: 37,
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
