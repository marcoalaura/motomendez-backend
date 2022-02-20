// 'use strict';

module.exports = {
  up(queryInterface) {
    let rolesMenusArray = [];

    // ADMIN 1
    let admin = [
      { fid_menu: 2, fid_rol: 1, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // { fid_menu: 3, fid_rol: 1, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // { fid_menu: 4, fid_rol: 1, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // { fid_menu: 5, fid_rol: 1, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // { fid_menu: 6, fid_rol: 1, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];
    rolesMenusArray = rolesMenusArray.concat(admin);
    
    // MINISTERIO
    let ministerio = [
      { fid_menu: 2, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // { fid_menu: 6, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_menu: 8, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_menu: 9, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_menu: 11, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_menu: 12, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_menu: 13, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      { fid_menu: 17, fid_rol: 2, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];
    rolesMenusArray = rolesMenusArray.concat(ministerio);
    
    // MUNICIPIO
    let municipio = [
      { fid_menu: 9, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      { fid_menu: 14, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      { fid_menu: 15, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      { fid_menu: 17, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      { fid_menu: 19, fid_rol: 3, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
    ];
    rolesMenusArray = rolesMenusArray.concat(municipio);
    
    // CONSULTA
    let consulta = [
      { fid_menu: 8, fid_rol: 4, method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
    ];
    rolesMenusArray = rolesMenusArray.concat(consulta);

    return queryInterface.bulkInsert('rol_menu', rolesMenusArray, {});
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
