import validate from 'express-validation';
import tutorValidation from './tutor.validation';

module.exports = (app) => {
  /**
   * @api {post} /centralizador/pcd/:id_pcd/tutor/:id_persona Registrar Tutores de Personas con Discapacidad
   * @apiName Registrar Tutores de Personas con Discapacidad
   * @apiGroup TUTOR
   * @apiVersion  1.0.0
   * @apiDescription Api para registro de tutores de personas con discapacidad
   * @apiParam {String} sexo Sexo del Tutor
   * @apiParam {String} telefono Telefono del Tutor
   * @apiParam {String} documento_descripcion Descripcion del Documento de Tutoria
   * @apiParam {String} documento_ruta DOcumento de Tutoria
   * @apiParam {String} fid_parametro parametro de parentezco
   *
   * @apiParamExample {json} Request-Example
    {
      "sexo": "F",
      "telefono": "2222222",
      "documento_descripcion": "Certificado de Nacimiento",
      "documento_ruta": "/xxx",
      "fid_parametro": "202"
    }
   * @apiSuccess (201) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (201) {String} mensaje Indica el mensaje de éxito de la creación
   * @apiSuccess (201) {Object[]} datos datos resultantes
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 201 OK
   {
    "finalizado": true,
    "mensaje": "Creación del registro exitoso.",
    "datos": {
      "id_tutor": 1,
      "estado": "ACTIVO",
      "_usuario_creacion": 2,
      "fid_pcd": 1,
      "fid_persona": 3,
      "documento_descripcion": "Certificado de Nacimiento",
      "documento_ruta": "/xxx",
      "fid_parametro": 202,
      "_fecha_modificacion": "2017-11-17T23:17:44.241Z",
      "_fecha_creacion": "2017-11-17T23:17:44.241Z",
      "_usuario_modificacion": null
    }
}
   *
   */
  app.api.post('/centralizador/pcd/:id_pcd/tutor/:id_persona', validate(tutorValidation.crearTutor), app.controller.tutor.crearTutor);

  /**
   * @api {post} /centralizador/tutor/:id Eliminar tutor
   * @apiName Eliminar tutor
   * @apiGroup TUTOR
   * @apiVersion  1.0.0
   * @apiDescription Api para eliminar tutor
   * @apiParam {String} id Identificador del tutor
   *
   * @apiSuccess (201) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (201) {String} mensaje Indica el mensaje de éxito de la creación
   * @apiSuccess (201) {Object[]} datos datos resultantes
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 201 OK
   {
     "finalizado": true,
     "mensaje": "Creación del registro exitoso.",
     "datos": {
    }
  }
  *
  */
  app.api.delete('/centralizador/tutor/:id', validate(tutorValidation.deleteTutor), app.controller.tutor.eliminarTutor);
};
