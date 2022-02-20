import validate from 'express-validation';
import paramValidation from './ruta.validation';

module.exports = (app) => {
  /**
   * @api {get} /api/v1/ruta Listar Rutas
   * @apiName ListarRutas
   * @apiGroup Rutas
   * @apiDescription Para devolver la lista de Rutas
   *
   * @apiParam {Ninguno} Sin Parámetros
   *
   * @apiSuccess {Integer} id_ruta Llave del ruta
   * @apiSuccess {String} ruta Dirección de la ruta
   * @apiSuccess {String} descripcion Descripción del ruta
   * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get de la ruta
   * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post de la ruta
   * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put de la ruta
   * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete de la ruta
   * @apiSuccess {String} estado Estado del Registro del ruta
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *{
   * "count": 5,
   * "rows": [
         {
           "id_ruta": 1,
           "ruta": "/api/v1/rol/",
           "descripcion": "Ruta para administrar roles",
           "method_get": true,
           "method_post": true,
           "method_put": true,
           "method_delete": true,
           "estado": "ACTIVO"
         },
         {
           "id_ruta": 2,
           "ruta": "/api/v1/usuario/",
           "descripcion": "Ruta para administrar usuarios",
           "method_get": true,
           "method_post": true,
           "method_put": true,
           "method_delete": true,
           "estado": "ACTIVO"
         },
   * ]
   * }
   *
   */
  app.api.get('/ruta', app.controller.ruta.get);

   /**
   * @api {get} /api/v1/ruta/:id Obtener Ruta
   * @apiName Obtener Ruta
   * @apiGroup Rutas
   * @apiDescription Para obtener un ruta
   *
   * @apiParam {Integer} id Identificador del ruta
   *
   * @apiSuccess {Integer} id_ruta Llave del ruta
   * @apiSuccess {String} ruta Dirección de la ruta
   * @apiSuccess {String} descripcion Descripción del ruta
   * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get de la ruta
   * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post de la ruta
   * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put de la ruta
   * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete de la ruta
   * @apiSuccess {String} estado Estado del Registro del ruta
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
       {
         "id_ruta": 1,
         "ruta": "/api/v1/rol/",
         "descripcion": "Ruta para administrar roles",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO"
       }
   *
   * @apiError No Content
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 204 No Content
   *     {
   *       "msg": "No existe el ruta."
   *     }
   */
  app.api.get('/ruta/:id', validate(paramValidation.getRutaId), app.controller.ruta.getId);

   /**
     * @api {post} /api/v1/ruta Registrar Ruta
     * @apiName Registrar Rutas
     * @apiGroup Rutas
     * @apiDescription Para registrar un ruta
     *
     * @apiParam {String} ruta Identificador del ruta
     * @apiParam {String} descripcion descripción de ruta
     * @apiParam {Boolean} method_get Habilita/Deshabilita el método get de la ruta
     * @apiParam {Boolean} method_post Habilita/Deshabilita el método post de la ruta
     * @apiParam {Boolean} method_put Habilita/Deshabilita el método put de la ruta
     * @apiParam {Boolean} method_delete Habilita/Deshabilita el método delete de la ruta
     *
     * @apiParamExample {json} Request-Example:
       {
         "ruta": "/api/v1/rol/",
         "descripcion": "Ruta para administrar roles",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true
       }
     *
     * @apiSuccess {Number} id_ruta Llave de la ruta
     * @apiSuccess {String} ruta Identificador de la ruta
     * @apiSuccess {String} descripcion Descripción de la ruta
     * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get de la ruta
     * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post de la ruta
     * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put de la ruta
     * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete de la ruta
     * @apiSuccess {String} estado Estado del Registro de la ruta
     * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
     * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
     * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
     * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *   {
     *     "id_ruta": 2,
           "ruta": "/api/v1/rol/",
           "descripcion": "Ruta para administrar roles",
           "method_get": true,
           "method_post": true,
           "method_put": true,
           "method_delete": true
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
     *       "msg": "notNull Violation: ruta cannot be null"
     *     }
     */
  app.api.post('/ruta', validate(paramValidation.createRuta), app.controller.ruta.post);

  /**
     * @api {put} /api/v1/ruta/:id Modificar Ruta
     * @apiName ModificarRuta
     * @apiGroup Rutas
     * @apiDescription Para modificar los datos de un ruta
     *
     * @apiParam {Integer} id Identificador del ruta
     *
     * @apiParamExample Request-Example
       {
         "ruta": "/api/v1/rol/",
         "descripcion": "Ruta para administrar roles",
         "method_get": true,
         "method_post": false,
         "method_put": true,
         "method_delete": false
       }
     *
     * @apiSuccess {Number} id_rol Llave del ruta
     * @apiSuccess {String} ruta Identificador del ruta
     * @apiSuccess {String} nombre Nombre del ruta
     * @apiSuccess {String} descripcion Descripción del ruta
     * @apiSuccess {Integer} peso Peso que establece el ruta con el cual se asocia al usuario por defecto
     * @apiSuccess {String} estado Estado del Registro del ruta
     * @apiSuccess {String} _usuario_creacion Usuario de Creacion del registro
     * @apiSuccess {String} _usuario_modificacion Usuario de Ultima modificacion del registro
     * @apiSuccess {Date} _fecha_creacion Fecha de Creacion del registro
     * @apiSuccess {Date} _fecha_modificacion Fecha de Ultima modificacion del registro
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *   {
     *     "id_ruta": 2,
           "ruta": "/api/v1/rol/",
           "descripcion": "Ruta para administrar roles",
           "method_get": true,
           "method_post": false,
           "method_put": true,
           "method_delete": false
     *     "estado": "ACTIVO",
     *     "_usuario_creacion": "1",
     *     "_fecha_modificacion": "2016-07-20T13:06:37.300Z",
     *     "_fecha_creacion": "2016-07-20T13:06:37.300Z",
     *     "_usuario_modificacion": '1'
     *   }
     * @apiError notNull Violación de Valores No Nulos.
     *
     * @apiErrorExample Not Null Violation
     *     HTTP/1.1 412 Not Null Violation
     *     {
     *       "msg": "notNull Violation: ruta cannot be null"
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
  app.api.put('/ruta/:id', validate(paramValidation.updateRuta), app.controller.ruta.put);
};
