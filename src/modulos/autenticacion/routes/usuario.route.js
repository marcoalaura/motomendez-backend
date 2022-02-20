import validate from 'express-validation';
import paramValidation from './usuario.validation';

module.exports = (app) => {
  /**
   * @api {get} /api/v1/usuario?order=&limit=&page=&filter= Lista
   * @apiName ListarUsuarios
   * @apiGroup Usuarios
   * @apiDescription Para devolver la lista de Usuarios
   *
   * @apiParam (Query) {Texto} order (Opcional) Campo por el cual se ordenará el resultado
   * @apiParam (Query) {Numerico} limit (Opcional) Cantidad de resultados a obtener
   * @apiParam (Query) {Numerico} page (Opcional) Número de página de resultados
   * @apiParam (Query) {Texto} filter (Opcional) Texto a buscar en los registros
   *
   * @apiSuccess {Number} id_usuario Id de usuario
   * @apiSuccess {String} email Correo electrónico del usuario
   * @apiSuccess {String} usuario Nombre de usuario del usuario
   * @apiSuccess {String} estado Estado del registro del usuario
   * @apiSuccess {String} persona.documento_identidad Documento de identidad de la persona
   * @apiSuccess {String} persona.complemento_documento Complemento del CI de la persona
   * @apiSuccess {Date} persona.fecha_nacimiento Fecha de Nacimiento de la persona
   * @apiSuccess {String} persona.nombres Nombres de la Persona
   * @apiSuccess {String} persona.primer_apellido Primer Apellido de la Persona
   * @apiSuccess {String} persona.segundo_apellido Segundo Apellido de la Persona
   * @apiSuccess {String} persona.casada_apellido Apellido de Casada de la Persona
   * @apiSuccess {String} persona.sexo Sexo de la Persona
   * @apiSuccess {String} usuarios_roles.id_usuario_rol Identificador de rol_usuario
   * @apiSuccess {String} usuarios_roles.rol.id_rol Identificador de rol
   * @apiSuccess {String} usuarios_roles.rol.nombre Nombre del rol
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *
   *  {
   *    "count": 2,
   *    "rows": [
   *        {
   *        "id_usuario": 1,
   *        "email": "admin",
   *        "usuario": "admin",
   *        "estado": "ACTIVO",
   *        "persona": {
   *          "documento_identidad": "0000000",
   *          "complemento_documento": "00",
   *          "fecha_nacimiento": "1980-01-01T00:00:00.000Z",
   *          "nombres": "AGETIC",
   *          "primer_apellido": "AGETIC",
   *          "segundo_apellido": "AGETIC",
   *          "casada_apellido": null,
   *          "sexo": "M",
   *        },
   *        "usuarios_roles": [
   *         {
   *           "id_rol": 1,
   *           "rol": {
   *             "id_rol": 1,
   *             "nombre": "ADMIN"
   *           }
   *         }
   *         ...
   *        ],
   *      },
   *      ...
   *    ]
   *  }
   */
  app.api.get('/usuario', app.controller.usuario.get);

  /**
   * @api {get} /api/v1/usuario/:id Obtener Usuario
   * @apiName Obtener Usuario
   * @apiGroup Usuarios
   * @apiDescription Para obtener un usuario
   *
   * @apiParam {Number} id Identificador del usuario
   *
   * @apiSuccess {Number} id_usuario Id de usuario
   * @apiSuccess {String} email Correo electrónico del usuario
   * @apiSuccess {String} usuario Nombre de usuario del usuario
   * @apiSuccess {String} estado Estado del registro del usuario
   * @apiSuccess {String} persona.documento_identidad Documento de identidad de la persona
   * @apiSuccess {String} persona.complemento_documento Complemento del CI de la persona
   * @apiSuccess {Date} persona.fecha_nacimiento Fecha de Nacimiento de la persona
   * @apiSuccess {String} persona.nombres Nombres de la Persona
   * @apiSuccess {String} persona.primer_apellido Primer Apellido de la Persona
   * @apiSuccess {String} persona.segundo_apellido Segundo Apellido de la Persona
   * @apiSuccess {String} persona.casada_apellido Apellido de Casada de la Persona
   * @apiSuccess {String} persona.sexo Sexo de la Persona
   * @apiSuccess {String} usuarios_roles.id_usuario_rol Identificador de rol_usuario
   * @apiSuccess {String} usuarios_roles.rol.id_rol Identificador de rol
   * @apiSuccess {String} usuarios_roles.rol.nombre Nombre del rol
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "id_usuario": 1,
   *       "email": "admin",
   *       "usuario": "admin",
   *       "estado": "ACTIVO",
   *       "persona": {
   *         "documento_identidad": "0000000",
   *         "complemento_documento": "00",
   *         "fecha_nacimiento": "1980-01-01T00:00:00.000Z",
   *         "nombres": "AGETIC",
   *         "primer_apellido": "AGETIC",
   *         "segundo_apellido": "AGETIC",
   *         "casada_apellido": null,
   *         "sexo": "M",
   *       },
   *       "usuarios_roles": [
   *         {
   *           "id_rol": 1,
   *           "rol": {
   *             "id_rol": 1,
   *             "nombre": "ADMIN"
   *           }
   *         }
   *         ...
   *       ]
   *     }
   *
   * @apiError No Content
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 204 No Content
   *     {
   *       "msg": "No existe el usuario."
   *     }
   */
  app.api.get('/usuario/:id', validate(paramValidation.getUsuarioId), app.controller.usuario.getId);

   /**
     * @api {post} /api/v1/usuario Registrar Usuarios
     * @apiName Registrar Usuarios
     * @apiGroup Usuarios
     * @apiDescription Para registrar un usuario
     * Registrar un usuario.
     *
     * @apiParam {String} email Email del usuario
     * @apiParam {String} fid_persona Id Persona del usuario
     * @apiParam {Array} roles Array con los roles del usuario
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *        "fid_persona": 100,
     *        "email": "correo@gmail.com",
     *        "roles": [3]
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "estado": "ACTIVO",
     *        "id_usuario": 5,
     *        "email": "correo@gmail.com",
     *        "fid_persona": 2,
     *        "cod_municipio": '020101',
     *      }
     *
     * @apiError notNull Violación de Valores No Nulos.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 412 Not Null Violation
     *     {
     *       "error": "notNull Violation: usuario cannot be null,\nnotNull Violation: email cannot be null"
     *     }
     */
  app.api.post('/usuario', validate(paramValidation.createUsuario), app.controller.usuario.post);

   /**
     * @api {put} /api/v1/usuario/:id Actualizar usuario
     * @apiName Actualizar Usuarios
     * @apiGroup Usuarios
     * @apiDescription Para actualizar un usuario
     * Actualizar un usuario.
     *
     * @apiParam {Number} id Identificador del usuario
     * @apiParam {String} correo del usuario
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *        "email": "correo@dominio.com"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "id_usuario": 5,
     *     }
     *
     * @apiError notNull Violación de Valores No Nulos.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 412 Not Null Violation
     *     {
     *       "error": "notNull Violation: usuario cannot be null,\nnotNull Violation: email cannot be null"
     *     }
     */
  app.api.put('/usuario/:id', validate(paramValidation.updateUsuario), app.controller.usuario.put);

   /**
    * @api {delete} /api/v1/usuario/:id Eliminar usuario
    * @apiName Eliminar Usuarios
    * @apiGroup Usuarios
    * @apiDescription Para Eliminar un usuario
    * Eliminar un usuario.
    *
    * @apiParam {Number} id Identificador del usuario
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *        "id_usuario": 5,
    *     }
    *
    * @apiError notNull Violación de Valores No Nulos.
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 412
    *     {
    *       "error": "El usuario no se encuentra registrado en el sistema o no esta activo."
    *     }
    */
  app.api.delete('/usuario/:id', validate(paramValidation.deleteUsuario), app.controller.usuario.delete);

  /**
    * @api {delete} /api/v1/usuario/:id Reenviar Correo
    * @apiName Reenviar Correo
    * @apiGroup Usuarios
    * @apiDescription Para Reenviar Correo
    * Reenviar Correo.
    *
    * @apiParam {Number} id Identificador del usuario
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *     }
    *
    * @apiError notNull Violación de Valores No Nulos.
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 412
    *     {
    *       "error": "El usuario no se encuentra registrado en el sistema o la cuenta ya esta activada."
    *     }
    */
  app.api.get('/usuario/:id/reenviar_correo', validate(paramValidation.reenviarCorreo), app.controller.usuario.reenviaCorreo);

  app.put('/activar', validate(paramValidation.activarUsuario), app.controller.usuario.activar);

  app.post('/contrasena/verificar_correo', validate(paramValidation.verificarCorreo), app.controller.usuario.verificarCorreo);

  app.post('/contrasena/restaurar', validate(paramValidation.modificarContrasena), app.controller.usuario.modificarContrasena);

  app.api.post('/usuarios/contrasena', validate(paramValidation.cambiarContrasena), app.controller.usuario.cambiarContrasena);
};
