// import validate from 'express-validation';
// import tutorValidation from './tutor.validation';

module.exports = (app) => {
  // ---------------------------- TMP CORTE ANUAL -------------------------------------
  /**
   * @api {post} /api/v1/centralizador/crear_corte Importar a la temporal corte anual
   * @apiName Importa información a la temporal corte anual
   * @apiGroup Corte Anual
   * @apiVersion  1.0.0
   * @apiDescription Realiza la importación de información desde un archivo CSV a la temporal corte anual
   * @apiParam (Param) {Numerico} audit_usuario ID del usuario de auditoria
   * @apiParam (Param) {file} file Archivo csv con la data
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Importación de datos exitoso.",
   *    "datos": []
   *  }
   */
  app.api.post('/centralizador/crear_corte', app.controller.tmp_corte_anual.importar);
  /**
   * @api {post} /api/v1/centralizador/contrastar_tmp_pcd Listar inforamcion corte anual
   * @apiName Listar información corte anual
   * @apiGroup Corte Anual
   * @apiVersion  1.0.0
   * @apiDescription Realiza la importación de información desde un archivo CSV a la temporal corte anual
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id Id del tipo de la persona con discapacidad
   * @apiSuccess {String} datos.rows.nro_documento Es el número de documento de la persona con discapacidad
   * @apiSuccess {String} datos.rows.primer_apellido Primer apellido de la persona con discapacidad
   * @apiSuccess {String} datos.rows.segundo_apellido Primer apellido de la persona con discapacidad
   * @apiSuccess {String} datos.rows.nombres Nombres de la persona con discapacidad
   * @apiSuccess {Date} datos.rows.fecha_nacimiento Fecha de nacimiento de la persona con discapacidad
   * @apiSuccess {String} datos.rows.estado_contrastacion Estado de la contrastación de la persona con discapacidad
   * @apiSuccess {String} datos.rows.observacion_contrastacion Observacion de la contratación de la persona con discapacidad
   * @apiSuccess {String} datos.rows.tipo Tipo de persona con discapacidad
   * @apiSuccess {String} datos.rows.estado Estado de la persona con discapacidad
   * @apiSuccess {String} datos.rows.observacion Observacion de la persona con discapacidad
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Obtencion de dato exitoso.",
   *    "datos": []
   "      id_pcd": 1,
   *      "persona": {
   *        "id": 2567,
   *        "nro_documento": "1234567",
   *        "primer_apellido": "MAMANI",
   *        "segundo_apellido": "MAMANI",
   *        "nombres": "JUAN",
   *        "fecha_nacimiento": "2000-01-01",
   *        "estado_contrastacion": "HABILITADO",
   *        "tipo": "SIPRUN",
   *        "estado": "HABILITADO",
   *        "observacion": "PERTENECE A LAS LISTA DEL IBC"
   *      },
   *  }
   */
  app.api.get('/centralizador/listar_corte', app.controller.tmp_corte_anual.listarCorte);
  app.api.post('/centralizador/filtrar_corte', app.controller.tmp_corte_anual.filtrar);
  app.api.get('/centralizador/tmp_corte_anual/:id', app.controller.tmp_corte_anual.obtenerRegistro);
  app.api.put('/centralizador/tmp_corte_anual/:id', app.controller.tmp_corte_anual.modificar);
  app.api.post('/centralizador/obtener_corte_anual', app.controller.tmp_corte_anual.obtenerCorteAnual);
  app.api.get('/centralizador/obtener_corte_anual', app.controller.tmp_corte_anual.obtenerEstadoCorteAnual);
  app.api.post('/centralizador/contrastar_corte_anual', app.controller.tmp_corte_anual.contrastarCorteAnual);
  app.api.post('/centralizador/cargar_tmp_corte_anual', app.controller.tmp_corte_anual.cargarTmpCorteAnual);
};
