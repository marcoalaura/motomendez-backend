import validate from 'express-validation';
import personaValidation from './persona.validation';
module.exports = (app) => {
   /**
   *
   * @api {post} /api/v1/centralizador/servicio/segip Verificar y Registrar persona
   * @apiName Registrar Personas SEGIP
   * @apiGroup SEGIP
   * @apiVersion  1.0.0
   * @apiDescription Api para registro de personas con discapacidad
   * @apiParam {Object} cedula_identidad Cedula de Identidad
   * @apiParam {Object} fecha_nacimiento Fecha de Nacimiento
   *
   * @apiParamExample {json} Request-Example
    {
      "cedula_identidad": "13546619",
      "fecha_nacimiento": "25/02/2014"
    }
   * @apiSuccess (200) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (200) {String} mensaje Indica el mensaje de éxito de la creación
   * @apiSuccess (200) {Object[]} datos datos resultantes
   * @apiSuccess (200) {Integer} datos.id_persona Id de la persona
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 201 OK
   {
      "finalizado": true,
      "mensaje": "Datos obtenidos exitosamente.",
      "datos": {
        "id_persona": 4
      }
    }
   *
   */
  app.api.post('/centralizador/servicio/segip', validate(personaValidation.segipPersona), app.controller.persona.segipPersona);
};
