import validate from 'express-validation';
import gestionValidation from './gestion.validation';

module.exports = (app) => {
  /**
   *
   * @api {get} /api/v1/centralizador/gestion Obtiene la lista de gestion de corte
   * @apiName Listar Gestiones de Corte
   * @apiGroup GESTION
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de gestiones de corte
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id_gestion Id de la gestion
   * @apiSuccess {Integer} datos.rows.gestion Gestion del corte
   * @apiSuccess {Integer} datos.rows.mes Mes del corte
   * @apiSuccess {Date} datos.rows.fecha_envio FEcha de envio del corte
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
     {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": {
        "count": 1,
        "rows": [
          {
            "id_gestion": 1,
            "gestion": 2017,
            "mes": 11,
            "fecha_envio": "2017-11-28T04:00:00.000Z",
            "estado": "ACTIVO",
            "_usuario_creacion": 2,
            "_usuario_modificacion": null,
            "_fecha_creacion": "2017-11-28T20:44:33.489Z",
            "_fecha_modificacion": "2017-11-28T20:44:33.489Z"
          }
        ]
      }
    }
   *
   */
  app.api.get('/centralizador/gestion', app.controller.gestion.listarGestion);

  /**
   *
   * @api {get} /api/v1/centralizador/detalle/listar?gestion= Obtiene la lista de gestiones y/o meses
   * @apiName Obtiene la lista de gestiones y/o meses
   * @apiGroup GESTION
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de gestiones y/o meses
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
     {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": []
      }
    }
   *
   */
  app.api.get('/centralizador/gestion/detalle/listar', app.controller.gestion.listarAnioMes);

 /**
  * @api {get} /api/v1/gestion/:id_gestion?cod_municipio Detalle de Corte Anual
  * @apiName Listar Detalle de Corte Anual
  * @apiGroup GESTION
  *
  * @apiVersion  1.0.0
  * @apiDescription Api para obtencion de datos de detalle de corte anual
  *
  * @apiParam (Parametro) {Integer} id_gestion Identificador de la gestion ID
  * @apiParam (Parametro) {String} cod_municipio Código del municipio
  *
  * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
  * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
  * @apiSuccess {Object} datos datos solicitados
  * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
  * @apiSuccess {Object[]} datos.rows array con los resultados
  * @apiSuccess {Integer} datos.rows.id_detalle Id  del detalle
  * @apiSuccess {Integer} datos.rows.estado Estado
  * @apiSuccess {Integer} datos.rows.nombre_completo Nombre del PCD
  * @apiSuccess {Integer} datos.rows.tipo_discapacidad Tipo de discapacidad del PCD
  * @apiSuccess {Integer} datos.rows.grado_discapacidad Grado de discapacidad del PCD
  * @apiSuccess {Integer} datos.rows.porcentaje_discapacidad Porcentaje de discapacidad del PCD
  * @apiSuccess {Integer} datos.rows.porcentaje_discapacidad Porcentaje de discapacidad del PCD
  * @apiSuccess {Integer} datos.rows.fecha_vigencia Fecha de vigencia del certificado del PCD
  * @apiSuccess {Integer} datos.rows.cod_municipio Codigo del Municipio del PCD
  * @apiSuccess {Integer} datos.rows.departamento Departamento del PCD
  * @apiSuccess {Integer} datos.rows.provincia Provincia del PCD
  * @apiSuccess {Integer} datos.rows.municipio Municipio del PCD
  * @apiSuccessExample {json} Success-Response:
  * HTTP/1.1 201 OK
    {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": {
        "count": 4,
        "rows": [
          {
            "id_detalle": 1,
            "estado": "GENERADO",
            "nombre_completo": "MARAZ NIEVES MARISOL YENI",
            "tipo_discapacidad": "AUDITIVO",
            "grado_discapacidad": "GRAVE",
            "porcentaje_discapacidad": 53,
            "fecha_vigencia": "2018-06-05T04:00:00.000Z",
            "cod_municipio": "060202",
            "departamento": "Tarija",
            "provincia": "Arce",
            "municipio": "Bermejo"
          },
         ...
        ]
      }
    }
 */
  app.api.get('/centralizador/gestion/:id_gestion', validate(gestionValidation.detalleGestion), app.controller.gestion.obtenerDetalleGestion);

  app.api.get('/centralizador/gestion_regularizados/:id_gestion', app.controller.gestion.obtenerDetalleRegularizadoGestion);

  app.api.get('/centralizador/acumulado/:id_gestion', validate(gestionValidation.detalleGestion), app.controller.gestion.obtenerDetalleAcumulado);

  /**
   *
   * @api {get} /api/v1/centralizador/detalle/listar_regularizado?gestion= Obtiene la lista de meses con regularizados o retroactivos
   * @apiName Obtiene la lista de gestiones y/o meses
   * @apiGroup GESTION
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de gestiones y/o meses
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
     {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": []
      }
    }
   *
   */
  app.api.get('/centralizador/gestion/detalle/listar_regularizado', app.controller.gestion.listarAnioMesRegularizado);

  app.api.get('/centralizador/gestion/detalle/listar_acumulado', app.controller.gestion.listarAnioMesAcumulado);
};
