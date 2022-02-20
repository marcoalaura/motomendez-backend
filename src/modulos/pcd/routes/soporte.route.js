
module.exports = (app) => {

  /**
   * @api {POST} /api/v1/centralizador/soporte Registrar incidente
   * @apiName Registrar incidente
   * @apiGroup SOPORTE
   * @apiVersion  1.0.0
   * @apiDescription Api para registrar incidente y su descripción
   * @apiParam {String} incidente Incidente
   * @apiParam {String} descripcion Descripción del incidente
   * @apiParamExample {json} Request
   * {
   *     "incidente": "Incidente",
   *     "descripcion": "Descripción incidente"
   * }
   * @apiSuccess (201) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (201) {String} mensaje Indica el mensaje de éxito del envio
   * @apiSuccess (201) {Object[]} datos datos resultantes
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *    "finalizado": true,
   *    "mensaje": "Solicitud enviada correctamente.",
   *    "datos": {}
   * }
   *
  */
  app.api.post('/centralizador/soporte', app.controller.soporte.crearRegistro);
};
