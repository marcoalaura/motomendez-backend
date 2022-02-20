// 'use strict';

module.exports = {
  up(queryInterface) {
    // ADMIN
    let rolesRutasArray = [];
    for (let i = 1; i <= 29; i ++) {
      const obj1 = {
        fid_ruta: i,
        fid_rol: 1,
        method_get: true,
        method_post: true,
        method_put: true,
        method_delete: true,
        estado: 'ACTIVO',
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
      };
      rolesRutasArray.push(obj1);
    }

    // ROL (2) CONALPEDIS
    let obj = [
      { fid_ruta: 5, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 7, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: true, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 8, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 9, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 10, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 11, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 14, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 15, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 16, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 17, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 18, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 19, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 20, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 21, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: true, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 13, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 22, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 23, fid_rol: 2, method_get: false, method_post: true, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 24, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 25, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 26, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 27, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 28, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 29, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 31, fid_rol: 2, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];

    rolesRutasArray = rolesRutasArray.concat(obj);
    
    // ROL (3) MUNICIPIO
    obj = [
      { fid_ruta: 8, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 9, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 10, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 11, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 20, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      { fid_ruta: 21, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: true, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 23, fid_rol: 3, method_get: false, method_post: true, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 24, fid_rol: 3, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 29, fid_rol: 3, method_get: true, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_ruta: 30, fid_rol: 3, method_get: false, method_post: true, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];
     rolesRutasArray = rolesRutasArray.concat(obj);

    // ROL (4) CONSULTA
    obj = [
      { fid_ruta: 16, fid_rol: 4, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      
     // { fid_ruta: 13, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];
    rolesRutasArray = rolesRutasArray.concat(obj);

    // ROL(5): SERVICIO-OVT
    obj = [
      { fid_ruta: 12, fid_rol: 5, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
     // { fid_ruta: 13, fid_rol: 5, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: '1', _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];
    rolesRutasArray = rolesRutasArray.concat(obj);

    return queryInterface.bulkInsert('rol_ruta', rolesRutasArray, {});
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
