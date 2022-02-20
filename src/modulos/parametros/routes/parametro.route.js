import validate from 'express-validation';
import parametroValidation from './parametro.validation';

module.exports = (app) => {
   /**
   *
   * @api {get} /api/v1/centralizador/parametro Obtiene la lista de parametros por grupo
   * @apiName Listar Parametros por Grupo
   * @apiGroup Parametro
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de parametros por grupo
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id_parametro Id del tipo del parametro
   * @apiSuccess {String} datos.rows.estado Estado del dato persona con discapacidad
   * @apiSuccess {String} datos.rows.grupo Grupo al que pertenece el parametro
   * @apiSuccess {Object} datos.rows.nombre Nombre del parametro
   * @apiSuccess {String} datos.rows.descripcion Descripcion del parametro
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
    {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": {
        "count": 3,
        "rows": [
          {
            "id_parametro": 200,
            "grupo": "PARENTESCO",
            "nombre": "TUTOR(A)",
            "descripcion": "TUTOR(A)"
          },
         ...
        ]
      }
    }
   *
   */
  app.api.get('/centralizador/parametro', validate(parametroValidation.obtenerListadoGrupo), app.controller.parametro.obtenerListadoGrupo);
};
