// import validate from 'express-validation';
// import tutorValidation from './tutor.validation';

module.exports = (app) => {
  // ---------------------------- TMP PCD -------------------------------------
  /**
   * @api {post} /api/v1/centralizador/contrastar_tmp_pcd Realiza la contrastación de la temporal PCD
   * @apiName Contrasta con el SEGIP, información de la temporal PCD
   * @apiGroup TMP_PCD
   * @apiVersion  1.0.0
   * @apiDescription Realiza la contrastación con el SEGIP de la información nueva que ingresa a la temporal PCD
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Contrastación realizado con éxito",
   *    "datos": []
   *  }
   */
  app.api.post('/centralizador/contrastar_tmp_pcd', app.controller.tmp_pcd.contrastarTmpPcd);
  /**
   * @api {post} /api/v1/centralizador/cargar_tmp_pcd Realiza la carga de la información registrada en la temporal Corte anual a la temporal PCD
   * @apiName Carga información desde la temporal Corte Anual a la temporal PCD
   * @apiGroup TMP_PCD
   * @apiVersion  1.0.0
   * @apiDescription Realiza la carga de información desde la temporal Corte Anual a la temporal PCD
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Ok",
   *    "datos": []
   *  }
   */
  app.api.post('/centralizador/cargar_tmp_pcd', app.controller.tmp_pcd.cargar);
  /**
   * @api {post} /api/v1/centralizador/registrar_tmp_pcd Realiza el registro de la información de la temporal PCD a la plataforma
   * @apiName Carga información desde la temporal PCD a la Plataforma
   * @apiGroup TMP_PCD
   * @apiVersion  1.0.0
   * @apiDescription Realiza el registro de la información de la temporal PCD a los registros de la plataforma correspondientes
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Ok",
   *    "datos": []
   *  }
   */
  app.api.post('/centralizador/registrar_tmp_pcd', app.controller.tmp_pcd.registrar);

  /**
   * @api {get} /api/v1/centralizador/tmp_pcd Listar datos
   * @apiName Obtener listado Personas con Discapacidad de SIPRUNPCD-IBC
   * @apiGroup SIPRUNPCD-IBC
   * @apiVersion  1.0.0
   * @apiDescription Obtener listado Personas con Discapacidad de SIPRUNPCD-IBC
   * @apiParam (Query) {Numerico} limit (Opcional) Cantidad de resultados a obtener
   * @apiParam (Query) {Numerico} page (Opcional) Número de página de resultados
   * @apiParam (Query) {String} documento_identidad (opcional) Documento de identidad
   * @apiParam (Query) {String} primer_apellido (opcional) Primer apellido
   * @apiParam (Query) {String} segundo_apellido (opcional) Segundo apellido
   * @apiParam (Query) {String} nombres (opcional) Nombres
   * @apiParam (Query) {String} tipo (obligatorio) Tipo de registro [SIPRUNPCD, IBC]
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id Id del registro
   * @apiSuccess {String} datos.rows.documento_identidad Numero del documento de identidad de la persona con discapacidad
   * @apiSuccess {String} datos.rows.complemento_documento Complemento del documento de identidad de la persona con discapacidad
   * @apiSuccess {String} datos.rows.primer_apellido Primer apellido de la persona con discapacidad
   * @apiSuccess {String} datos.rows.segundo_apellido Segundo apellido de la persona con discapacidad
   * @apiSuccess {String} datos.rows.nombres Nombres de la persona con discapacidad
   * @apiSuccess {String} datos.rows.fecha_nacimiento Fecha de Nacimiento de la persona con discapacidad
   * @apiSuccess {String} datos.rows.codigo_municipio Código de municipio
   * @apiSuccess {String} datos.rows.estado_contrastacion Estado contrastación
   * @apiSuccess {String} datos.rows.observacion_contrastación Observacion de contrastación
   * @apiSuccess {String} datos.rows.tipo Tipo de registro (SIPRUNPCD, IBC)
   * @apiSuccess {String} datos.rows.observacion_estado Observacion de estado
   * @apiSuccess {String} datos.rows.expedido Expedido departamento de documento de identidad
   * @apiSuccess {String} datos.rows.formato_inf Formato impresión de nombres
   * @apiSuccess {String} datos.rows.estado_civil Estado civil
   * @apiSuccess {String} datos.rows.direccion Dirección
   * @apiSuccess {String} datos.rows.fecha_vigencia Fecha de vigencia del carnet de discapacidad
   * @apiSuccess {Object} datos.rows.tipo_discapacidad Tipo de Discapacidad
   * @apiSuccess {Object} datos.rows.grado_discapacidad Grado de Discapacidad
   * @apiSuccess {Object} datos.rows.porcentaje_discapacidad Porcentaje de Discapacidad
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * {
   *    "finalizado": true,
   *    "mensaje": "Obtencion de dato exitoso.",
   *    "datos": {
   *      "count": 1,
   *      "rows": [{
   *        "id": 1,
   *        "documento_identidad": "1234567",
   *        "primer_apellido": "MAMANI",
   *        "segundo_apellido": "MAMANI",
   *        "nombres": "JUAN",
   *        "fecha_nacimiento": "1900-01-01",
   *        "codigo_municipio": "70101",
   *        "estado_contrastacion": "OBSERVADO",
   *        "observacion_contrastacion": "No coinciden: FechaNacimiento ",
   *        "tipo": "SIPRUNPCD",
   *        "observacion_estado": null,
   *        "complemento_documento": null,
   *        "expedido": 7,
   *        "formato_inf": "NUAC",
   *        "estado_civil": "S",
   *        "direccion": "C/7 #4",
   *        "fecha_vigencia": "2023-11-15",
   *        "tipo_discapacidad": "INTELECTUAL",
   *        "grado_discapacidad": "GRAVE",
   *        "porcentaje_discapacidad": 70
   *      }]
   *    }
   *  }
   */
  app.api.get('/centralizador/tmp_pcd', app.controller.tmp_pcd.listar);

  /**
   * @api {get} /api/v1/centralizador/tmp_pcd/:id Obtener detalle
   * @apiName obtener detalle de SIPRUNPCD-IBC
   * @apiGroup SIPRUNPCD-IBC
   * @apiVersion  1.0.0
   * @apiDescription Obtiene el detalle de una persona de SIPRUNPCD-IBC
   * @apiParam (param) {Numerico} id (Obligatorio) identificador del registro
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {String} datos.documento_identidad Numero del documento de identidad de la persona con discapacidad
   * @apiSuccess {String} datos.complemento_documento Complemento del documento de identidad de la persona con discapacidad
   * @apiSuccess {String} datos.expedido Expedido departamento de documento de identidad
   * @apiSuccess {String} datos.primer_apellido Primer apellido de la persona con discapacidad
   * @apiSuccess {String} datos.segundo_apellido Segundo apellido de la persona con discapacidad
   * @apiSuccess {String} datos.nombres Nombres de la persona con discapacidad
   * @apiSuccess {String} datos.estado_civil Estado civil
   * @apiSuccess {String} datos.formato_inf Formato impresión de nombres
   * @apiSuccess {String} datos.fecha_nacimiento Fecha de Nacimiento de la persona con discapacidad
   * @apiSuccess {String} datos.telefono Telefono
   * @apiSuccess {String} datos.fecha_vigencia Fecha de vigencia del carnet de discapacidad
   * @apiSuccess {String} datos.estado_contrastacion Estado contrastación
   * @apiSuccess {String} datos.direccion Dirección
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * {
   *   "finalizado": true,
   *   "mensaje": "Obtencion de dato exitoso.",
   *   "datos": {
   *     "id": 1,
   *     "documento_identidad": "1234567",
   *     "complemento_documento": null,
   *     "expedido": 7,
   *     "primer_apellido": "MAMANI",
   *     "segundo_apellido": "MAMANI",
   *     "casada_apellido": null,
   *     "nombres": "JUAN",
   *     "estado_civil": "S",
   *     "formato_inf": "NUAC",
   *     "fecha_nacimiento": "1900-01-01",
   *     "telefono": null,
   *     "fecha_registro": "2023-11-15",
   *     "estado_contrastacion": "OBSERVADO",
   *     "direccion": "C/7 #4",
   *   }
   * }
   */
  app.api.get('/centralizador/tmp_pcd/:id', app.controller.tmp_pcd.obtener);
  /**
   * @api {PUT} /api/v1/centralizador/edicion-pcd Modificar
   * @apiName Modificar datos de SIPRUNPCD-IBC
   * @apiGroup SIPRUNPCD-IBC
   * @apiVersion  1.0.0
   * @apiDescription Api para actualizar datos de SIPRUNPCD-IBC
   * @apiParam {Int} id_pcd Identificador del registro PCD
   * @apiParam {String} documento_identidad Documento de identidad de la persona
   * @apiParam {String} complemento Complemento documento identidad de la persona
   * @apiParam {String} fecha_nacimiento Fecha de nacimiento de la persona
   * @apiParam {String} primer_apellido Primer apellido de la persona
   * @apiParam {String} segundo_apellido Segundo apellido de la persona
   * @apiParam {String} nombres Nombres de la persona
   * @apiParam {String} casada_apellido Apellido de casada de la persona
   * @apiParam {String} telefono Teléfono
   * @apiParam {String} estado_civil Estado civil
   * @apiParam {String} formato_inf Formato de información
   * @apiParam {String} expedido Expedido documento de identidad
   * @apiParamExample {json} Request-Documento-identidad
   * {
   *   "fecha_nacimiento": "1900-01-01",
   *   "complemento_documento": null,
   *   "primer_apellido": "MAMANI",
   *   "segundo_apellido": "MAMANI",
   *   "nombres": "JUAN",
   *   "casada_apellido": null,
   *   "telefono": null,
   *   "estado_civil": "S",
   *   "formato_inf": "NUAC",
   *   "expedido": 7
   * }
   * @apiSuccess (201) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (201) {String} mensaje Indica el mensaje de éxito de la creación
   * @apiSuccess (201) {Object[]} datos resultantes
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 201 OK
   * {
   *    "finalizado": true,
   *    "mensaje": "Datos actualizados correctamente.",
   *    "datos": {}
   * }
   *
  */
  app.api.put('/centralizador/tmp_pcd/:id', app.controller.tmp_pcd.modificar);

  app.api.put('/centralizador/tmp_pcd_secundario/:id', app.controller.tmp_pcd.modificarSecundario);
};
