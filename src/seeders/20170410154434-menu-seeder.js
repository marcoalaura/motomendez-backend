// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('menu', [

      // --------------------- ADMINISTRACIÓN -------------------------------
      // 1
      { nombre: 'GESTIÓN DE USUARIOS', descripcion: 'Administración', orden: 100, ruta: '', icono: 'users', method_get: false, method_post: false, method_put: false, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 2
      { nombre: 'USUARIOS', descripcion: 'Administración de usuarios', orden: 1, ruta: 'usuarios', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 1, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 3
      { nombre: 'RUTAS', descripcion: 'Administración de rutas', orden: 2, ruta: 'rutas', icono: 'code', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 1, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 4
      { nombre: 'ROLES', descripcion: 'Administración de roles', orden: 3, ruta: 'roles', icono: 'credit_card', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 1, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 5
      { nombre: 'MENÚS', descripcion: 'Administración de menús', orden: 4, ruta: 'menus', icono: 'menu', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 1, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 6
      { nombre: 'USUARIOS MUNICIPIOS', descripcion: 'Administración de usuario de municipios', orden: 10, ruta: 'usuarios_municipios', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 1, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },

      // --------------------- PCD -------------------------------
      // 7
      { nombre: 'PCD - TUTORES', descripcion: 'Módulo de PCD', orden: 100, ruta: '', icono: 'wheelchair', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 8
      { nombre: 'DATOS PCD', descripcion: 'Administración de PCD y tutores', orden: 1, ruta: 'informacion_pcd', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 7, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 9
      { nombre: 'REGISTRO DE TUTORES', descripcion: 'Administración de PCD y tutores', orden: 2, ruta: 'listado_general', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 7, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      
      // --------------------- LISTAS BONO -------------------------------
      // 10
      { nombre: 'LISTAS BONO', descripcion: 'Módulo de listados de bonos', orden: 200, ruta: '', icono: 'list', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 11
      { nombre: 'GENERAR LISTAS', descripcion: 'Listas', orden: 1, ruta: 'generar_lista', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 10, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 12
      { nombre: 'HABILITADOS MENSUAL', descripcion: 'Habilitados mensual ministerio', orden: 2, ruta: 'listado_bono', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 10, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 13
      { nombre: 'OBSERVADOS MENSUAL', descripcion: 'Observados mensual ministerio', orden: 2, ruta: 'listado_general_mes', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 10, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },
      // 14
      { nombre: 'HABILITADOS MENSUAL', descripcion: 'Habilitados mensual municipio', orden: 2, ruta: 'listado_municipio', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 10, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      // 15
      { nombre: 'OBSERVADOS MENSUAL', descripcion: 'Observados mensual municipio', orden: 2, ruta: 'listado_general_municipio', icono: 'group', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 10, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      
      // --------------------- CONSULTAS -------------------------------
      // 16
      { nombre: 'CONSULTAS', descripcion: 'Módulo de consultas', orden: 9, ruta: '', icono: 'search', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      // 17
      { nombre: 'CORTE ANUAL', descripcion: 'Listas para consultar en el corte anual', orden: 9, ruta: 'listado_general_anual', icono: 'list', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 16, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      
      // --------------------- SOPORTE -------------------------------
      // 18
      { nombre: 'SOPORTE', descripcion: 'Módulo para soporte', orden: 10, ruta: '', icono: 'envelope', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
      // 19
      { nombre: 'SOPORTE', descripcion: 'Registro', orden: 10, ruta: 'soporte', icono: 'envelope', method_get: true, method_post: true, method_put: true, method_delete: false, estado: 'ACTIVO', fid_menu_padre: 18, _usuario_creacion: 1, _fecha_creacion: new Date(), _fecha_modificacion: new Date() },      
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
