import validate from 'express-validation';
import paramValidation from './menu.validation';

module.exports = (app) => {
  /**
   * @api {get} /api/v1/menu Listar Menus
   * @apiName ListarMenus
   * @apiGroup Menus
   * @apiDescription Para devolver la lista de Menus
   *
   * @apiParam {Ninguno} Sin Parámetros
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
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *{
   *  "count": 1,
   *  "rows": [
         {
           "id_menu": 1,
           "nombre": "CONFIGURACIÓN",
           "descripcion": "Configuración",
           "orden": 1,
           "ruta": "config",
           "icono": "config",
           "method_get": true,
           "method_post": true,
           "method_put": true,
           "method_delete": true,
           "estado": "ACTIVO",
           "fid_menu_padre": null
        },
   *   ]
   * }
   *
   */
  app.api.get('/menu', app.controller.menu.get);

   /**
   * @api {get} /api/v1/menu/:id Obtener menú
   * @apiName Obtener menú
   * @apiGroup Menus
   * @apiDescription Para obtener un menú
   *
   * @apiParam {Integer} id Identificador del menú
   *
   * @apiSuccess {Integer} id_menu Llave del menú
   * @apiSuccess {String} nombre Identificador del menú
   * @apiSuccess {String} descripcion Descripción del menú
   * @apiSuccess {Integer} orden Precedencia para el orden del menú
   * @apiSuccess {String} ruta Url del menú
   * @apiSuccess {String} icono Icono de menú
   * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get del menú
   * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post del menú
   * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put del menú
   * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete del menú
   * @apiSuccess {Integer} fid_menu_padre Identifica la relación con el menú padre
   * @apiSuccess {String} estado Estado del Registro del menú
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
     {
       "id_menu": 1,
       "nombre": "CONFIGURACIÓN",
       "descripcion": "Configuración",
       "orden": 1,
       "ruta": "config",
       "icono": "config",
       "method_get": true,
       "method_post": true,
       "method_put": true,
       "method_delete": true,
       "fid_menu_padre": null
       "estado": "ACTIVO",
      },
   *
   * @apiError No Content
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 204 No Content
   *     {
   *       "msg": "No existe el menú."
   *     }
   */
  app.api.get('/menu/:id', validate(paramValidation.getMenuId), app.controller.menu.getId);

   /**
     * @api {post} /api/v1/menu Registrar Menú
     * @apiName Registrar Menú
     * @apiGroup Menus
     * @apiDescription Para registrar un menú
     *
     * @apiParam {String} nombre Nombre del menú
     * @apiParam {String} descripcion Descripción adicional del menú
     * @apiParam {Integer} orden Número que identifica el orden menú
     * @apiParam {String} ruta ruta del menú
     * @apiParam {String} icono ruta del icono de menú
     * @apiParam {Boolean} method_get Habilita/Deshabilita el método get del menú
     * @apiParam {Boolean} method_post Habilita/Deshabilita el método post del menú
     * @apiParam {Boolean} method_put Habilita/Deshabilita el método put del menú
     * @apiParam {Boolean} method_delete Habilita/Deshabilita el método delete del menú
     * @apiParam {Integer} fid_menu_padre Identifica la relación con el menú padre
     *
     * @apiParamExample {json} Request-Example:
     *   {
     *     "nombre": "CONFIGURACIÓN",
            "descripcion": "Configuración",
            "orden": 1,
            "ruta": "config",
            "icono": "config",
            "method_get": true,
            "method_post": true,
            "method_put": true,
            "method_delete": true,
            "fid_menu_padre": null
     *    }
     *
     * @apiSuccess {Integer} id_menu Llave del menú
     * @apiSuccess {String} nombre Identificador del menú
     * @apiSuccess {String} descripcion Descripción del menú
     * @apiSuccess {Integer} orden Orden para la ordenación del menú
     * @apiSuccess {String} ruta Url del menú
     * @apiSuccess {String} icono Icono de menú
     * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get del menú
     * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post del menú
     * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put del menú
     * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete del menú
     * @apiSuccess {Integer} fid_menu_padre Identifica la relación con el menú padre
     * @apiSuccess {String} estado Estado del Registro del menú
     * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
     * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
     * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
     * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
       {
         "id_menu": 5,
         "nombre": "CONFIGURACIÓN",
         "descripcion": "Configuración",
         "orden": 1,
         "ruta": "config",
         "icono": "config",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO",
         "_usuario_creacion": "1",
         "_fecha_modificacion": "2016-07-20T14:44:18.597Z",
         "_fecha_creacion": "2016-07-20T14:44:18.597Z",
         "_usuario_modificacion": null,
         "fid_menu_padre": null
       }
     *
     * @apiError notNull Violación de Valores No Nulos.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 412 Not Null Violation
     *     {
     *       "msg": "notNull Violation: nombre cannot be null,\nnotNull Violation: orden cannot be null"
     *     }
  */
  app.api.post('/menu', validate(paramValidation.createMenu), app.controller.menu.post);

  /**
     * @api {put} /api/v1/menu/:id Modificar menú
     * @apiName ModificarMenu
     * @apiGroup Menus
     * @apiDescription Para modificar los datos de un menú
     *
     * @apiParam {Integer} id Identificador del menú
     *
     * @apiParamExample Request-Example
     * {
         "nombre": "CONFIGURACIÓN",
         "descripcion": "Configuración",
         "orden": 1,
         "ruta": "config",
         "icono": "config",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "fid_menu_padre": null
     * }
     *
     * @apiSuccess {Integer} id_menu Llave del menú
     * @apiSuccess {String} nombre Identificador del menú
     * @apiSuccess {String} descripcion Descripción del menú
     * @apiSuccess {Integer} orden Precedencia par el orden del menú
     * @apiSuccess {String} ruta Url del menú
     * @apiSuccess {String} icono Icono de menú
     * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get del menú
     * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post del menú
     * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put del menú
     * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete del menú
     * @apiSuccess {Integer} fid_menu_padre Identifica la relación con el menú padre
     * @apiSuccess {String} estado Estado del Registro del menú
     * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
     * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
     * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
     * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
       {
         "id_menu": 5,
         "nombre": "CONFIGURACIÓN",
         "descripcion": "Configuración",
         "orden": 1,
         "ruta": "config",
         "icono": "config",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO",
         "_usuario_creacion": "1",
         "_fecha_modificacion": "2016-07-20T14:44:18.597Z",
         "_fecha_creacion": "2016-07-20T14:44:18.597Z",
         "_usuario_modificacion": null,
         "fid_menu_padre": null
       }
     *
     * @apiError notNull Violación de Valores No Nulos.
     *
     * @apiErrorExample Not Null Violation
     *     HTTP/1.1 412 Not Null Violation
     *     {
     *       "msg": "notNull Violation: nombre cannot be null"
     *     }
     *
     *
     * @apiError notFound NotFound
     *
     * @apiErrorExample Not Found
     *     HTTP/1.1 412 Not Found
     *     {
     *       "msg": "notFound"
     *     }
  */
  app.api.put('/menu/:id', validate(paramValidation.updateMenu), app.controller.menu.put);
};
