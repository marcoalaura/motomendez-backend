import validate from 'express-validation';
import paramValidation from './rol_menu.validation';

module.exports = (app) => {
   /**
   * @api {get} /api/v1/rol_menu/:id Listar menús y submenús por rol
   * @apiName ListarMenusSubmenus
   * @apiGroup Menus
   * @apiDescription Para devolver la lista de Menus y Submenús con permisos del rol
   * asociado
   *
   * @apiParam {Integer} id Identificador del rol
   *
   * @apiSuccess {Integer} id_menu Llave del menú
   * @apiSuccess {String} nombre Nombre del menú
   * @apiSuccess {String} descripcion Descripción del menú
   * @apiSuccess {Integer} orden Precedencia en el orden del menú
   * @apiSuccess {String} ruta ruta del menú
   * @apiSuccess {String} icono icono del menú
   * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get del menú
   * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post del menú
   * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put del menú
   * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete del menú
   * @apiSuccess {Integer} fid_menu_padre Identifica la relación con el menú padre
   * @apiSuccess {String} estado Estado del Registro del menú
   * @apiSuccess {Boolean} get Identifica el permiso para ver
   * @apiSuccess {Boolean} post Identifica el permiso para crear
   * @apiSuccess {Boolean} put Identifica el permiso para modificar
   * @apiSuccess {Boolean} delete Identifica el permiso para eliminar
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *
     [
       {
         "id_menu": 1,
         "nombre": "CONFIGURACIÓN",
         "descripcion": "Configuración",
         "orden": 1,
         "ruta": "config",
         "icono": "settings",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO",
         "fid_menu_padre": null,
         "submenus": [
           {
             "id_menu": 2,
             "nombre": "USUARIOS",
             "descripcion": "Administración de usuarios",
             "orden": 1,
             "ruta": "usuarios",
             "icono": "group",
             "method_get": true,
             "method_post": true,
             "method_put": true,
             "method_delete": true,
             "estado": "ACTIVO",
             "fid_menu_padre": 1,
             "get": true,
             "post": true,
             "put": true,
             "delete": true
           },
           {
             "id_menu": 3,
             "nombre": "ROLES",
             "descripcion": "Administración de roles",
             "orden": 2,
             "ruta": "roles",
             "icono": "credit_card",
             "method_get": true,
             "method_post": true,
             "method_put": true,
             "method_delete": true,
             "estado": "ACTIVO",
             "fid_menu_padre": 1,
             "get": true,
             "post": true,
             "put": true,
             "delete": true
           },
           {
             "id_menu": 4,
             "nombre": "ALBERGUES",
             "descripcion": "Administración de albergues",
             "orden": 4,
             "ruta": "roles",
             "icono": "credit_card",
             "method_get": true,
             "method_post": true,
             "method_put": true,
             "method_delete": true,
             "estado": "ACTIVO",
             "fid_menu_padre": 1
           }
         ]
       }
     ]
   *
   */
  app.api.get('/rol_menu/:id', validate(paramValidation.getRolMenuId), app.controller.rolMenu.getId);
};
