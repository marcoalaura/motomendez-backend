import validate from 'express-validation';
import paramValidation from './rol_ruta.validation';

module.exports = (app) => {
   /**
   * @api {get} /api/v1/rol_ruta/:id Listar rutas por rol
   * @apiName ListarRolRuta
   * @apiGroup Rutas
   * @apiDescription Para devolver la lista de Rutas con permisos del rol
   * asociado
   *
   * @apiParam {Integer} id Identificador del rol
   *
   * @apiSuccess {Integer} id_ruta Llave de la ruta
   * @apiSuccess {String} ruta Dirección de la ruta
   * @apiSuccess {String} descripcion Descripción del ruta
   * @apiSuccess {Boolean} method_get Habilita/Deshabilita el método get de la ruta
   * @apiSuccess {Boolean} method_post Habilita/Deshabilita el método post de la ruta
   * @apiSuccess {Boolean} method_put Habilita/Deshabilita el método put de la ruta
   * @apiSuccess {Boolean} method_delete Habilita/Deshabilita el método delete de la ruta
   * @apiSuccess {String} estado Estado del Registro del ruta
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
         "id_ruta": 2,
         "ruta": "/api/v1/usuarios/",
         "descripcion": "Ruta para administrar usuarios",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO",
         "get": true,
         "post": true,
         "put": true,
         "delete": true
       },
       {
         "id_ruta": 3,
         "ruta": "/api/v1/menus/",
         "descripcion": "Ruta para administrar menus",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO",
         "get": true,
         "post": true,
         "put": true,
         "delete": true
       },
       {
         "id_ruta": 4,
         "ruta": "/api/v1/rutas/",
         "descripcion": "Ruta para administrar rutas",
         "method_get": true,
         "method_post": true,
         "method_put": true,
         "method_delete": true,
         "estado": "ACTIVO",
         "get": true,
         "post": true,
         "put": true,
         "delete": true
       }
     ]
   *
   */
  app.api.get('/rol_ruta/:id', validate(paramValidation.getRolRutaId), app.controller.rolRuta.getId);
};
