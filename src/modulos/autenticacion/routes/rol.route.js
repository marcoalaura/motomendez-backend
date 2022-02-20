import validate from 'express-validation';
import paramValidation from './rol.validation';

module.exports = (app) => {
   /**
   * @api {get} /api/v1/roles Listar Roles
   * @apiName ListarRoles
   * @apiGroup Roles
   * @apiDescription Para devolver la lista de Roles
   *
   * @apiParam {Ninguno} Sin Parámetros
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *{
   *  "count": 1,
   *  "rows": [
   *    {
   *     "id_rol": 1,
   *     "nombre": "ADMINISTRADOR",
   *     "descripcion": "aDMINISTRADOR",
   *     "peso": 20,
   *     "estado": "ACTIVO"
   *    }
   *  ]
   *}
   *
   */
  app.api.get('/rol', app.controller.rol.get);

  /**
   * @api {get} /api/v1/rol/:id Obtener Rol
   * @apiName Obtener Rol
   * @apiGroup Roles
   * @apiDescription Para obtener un rol
   *
   * @apiParam {Integer} id Identificador del rol
   *
   * @apiSuccess {Number} id_rol Llave del rol
   * @apiSuccess {String} nombre Nombre del rol
   * @apiSuccess {String} descripcion Descripción del rol
   * @apiSuccess {Integer} peso Peso que establece el rol con el cual se asocia al usuario por defecto
   * @apiSuccess {String} estado Estado del Registro del rol
   * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
   * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
   * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
   * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *   {
   *     "id_rol": 2,
   *     "nombre": "ADMINISTRADOR",
   *     "descripcion": "aDMINISTRADOR",
   *     "peso": 2,
   *     "estado": "ACTIVO",
   *     "_usuario_creacion": "1",
   *     "_fecha_modificacion": "2016-07-20T13:06:37.300Z",
   *     "_fecha_creacion": "2016-07-20T13:06:37.300Z",
   *     "_usuario_modificacion": null
   *   }
   *
   * @apiError No Content
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 204 No Content
   *     {
   *       "msg": "No existe el rol."
   *     }
   */

  app.api.get('/rol/:id', validate(paramValidation.getRolId), app.controller.rol.getId);
  /**
     * @api {post} /api/v1/rol Registrar Rol
     * @apiName Registrar Roles
     * @apiGroup Roles
     * @apiDescription Para registrar un rol
     *
     * @apiParam {String} nombre Nombre de rol
     * @apiParam {String} descripcion Descripción adicional del rol
     * @apiParam {Integer} peso Número que identifica el rol con mayor peso
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *        "nombre": "TECNICO",
     *        "descripcion": "Técnico",
     *        "peso": 2
     *      }
     *
     * @apiSuccess {Number} id_rol Llave del rol
     * @apiSuccess {String} nombre Nombre del rol
     * @apiSuccess {String} descripcion Descripción del rol
     * @apiSuccess {Integer} peso Peso que establece el rol con el cual se asocia al usuario por defecto
     * @apiSuccess {String} estado Estado del Registro del rol
     * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
     * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
     * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
     * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *   {
     *     "id_rol": 2,
     *     "nombre": "ADMINISTRADOR",
     *     "descripcion": "aDMINISTRADOR",
     *     "peso": 2,
     *     "estado": "ACTIVO",
     *     "_usuario_creacion": "1",
     *     "_fecha_modificacion": "2016-07-20T13:06:37.300Z",
     *     "_fecha_creacion": "2016-07-20T13:06:37.300Z",
     *     "_usuario_modificacion": null
     *   }
     *
     * @apiError notNull Violación de Valores No Nulos.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 412 Not Null Violation
     *     {
     *       "msg": "notNull Violation: rol cannot be null,\nnotNull Violation: nombre cannot be null"
     *     }
     */
  app.api.post('/rol', validate(paramValidation.createRol), app.controller.rol.post);
  /**
   * @api {put} /api/v1/rol/:id Modificar Rol
   * @apiName ModificarRol
   * @apiGroup Roles
   * @apiDescription Para modificar los datos de un rol
   *
   * @apiParam {Integer} id Identificador del rol
   *
   * @apiParamExample Request-Example
   * {
   *   "nombre": "nombre a modificar",
   *   "descripcion": "Descripción del rol modificado",
   *   "peso": 10
   * }
   *
   * @apiSuccess {Number} id_rol Llave del rol
   * @apiSuccess {String} nombre Nombre del rol
   * @apiSuccess {String} descripcion Descripción del rol
   * @apiSuccess {Integer} peso Peso que establece el rol con el cual se asocia al usuario por defecto
   * @apiSuccess {String} estado Estado del Registro del rol
   * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
   * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
   * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
   * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *   {
   *     "id_rol": 2,
   *     "nombre": "nombre a modificar",
   *     "descripcion": "Descripción del rol modificado",
   *     "peso": 10,
   *     "estado": "ACTIVO",
   *     "_usuario_creacion": "1",
   *     "_fecha_modificacion": "2016-07-20T13:06:37.300Z",
   *     "_fecha_creacion": "2016-07-20T13:06:37.300Z",
   *     "_usuario_modificacion": null
   *   }
   * @apiError notNull Violación de Valores No Nulos.
   *
   * @apiErrorExample Not Null Violation
   *     HTTP/1.1 412 Not Null Violation
   *     {
   *       "msg": "notNull Violation: rol cannot be null"
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
  app.api.put('/rol/:id', validate(paramValidation.updateRol), app.controller.rol.put);
};
