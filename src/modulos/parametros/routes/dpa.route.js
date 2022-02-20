import validate from 'express-validation';
import parametroValidation from './parametro.validation';

module.exports = (app) => {
  /**
   *
   * @api {get} /api/v1/centralizador/dpa Obtiene la lista de departamentos
   * @apiName Listar Departamentos
   * @apiGroup Dpa
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de departamentos
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id_dpa Id del dpa
   * @apiSuccess {String} datos.rows.departamento Departamento
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
    {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": {
        "count": 9,
        "rows": [
          {
            "id_dpa": 306,
            "departamento": "Beni"
          },
         ...
        ]
      }
    }
   *
   */
  app.api.get('/centralizador/dpa', app.controller.dpa.obtenerDepartamentos);
  app.get('/centralizador/dpa', app.controller.dpa.obtenerDepartamentos);

  /**
   *
   * @api {get} /api/v1/centralizador/dpa/:id_departamento Obtiene la lista de Provincias por Id departamento
   * @apiName Listar Provincias
   * @apiGroup Dpa
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de provincias por departamento
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id_dpa Id del dpa
   * @apiSuccess {String} datos.rows.provincia Provincia
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": {
        "count": 10,
        "rows": [
          {
            "id_dpa": 4,
            "provincia": "Azurduy"
          },
         ...
        ]
      }
    }
   *
   */
  app.api.get('/centralizador/dpa/:id_departamento', app.controller.dpa.obtenerProvincias);
  app.get('/centralizador/dpa/:id_departamento', app.controller.dpa.obtenerProvincias);

  /**
   *
   * @api {get} /api/v1/centralizador/dpa/:id_departamento/provincia/:id_provincia Obtiene la lista de Municipios por Id provincia
   * @apiName Listar Municipios
   * @apiGroup Dpa
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de municipios por provincia
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id_dpa Id del dpa
   * @apiSuccess {String} datos.rows.municipio Municipio
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
    {
      "finalizado": true,
      "mensaje": "Obtencion de dato exitoso.",
      "datos": {
        "count": 4,
        "rows": [
          {
            "id_dpa": 19,
            "cod_municipio": "010701",
            "municipio": "Camargo",
            "cod_unidad_territorial": "010701"
          },
         ...
        ]
      }
    }
   *
   */
  app.api.get('/centralizador/dpa/:id_departamento/provincia/:id_provincia', app.controller.dpa.obtenerMunicipios);
  app.get('/centralizador/dpa/:id_departamento/provincia/:id_provincia', app.controller.dpa.obtenerMunicipios);

  app.api.get('/centralizador/dpa/municipio/buscar', app.controller.dpa.buscarMunicipio);
};
